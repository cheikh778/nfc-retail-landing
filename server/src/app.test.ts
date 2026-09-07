import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from './app.js';
import { logger } from './lib/logger.js';
import { UnconfiguredCrmClient } from './services/crm/UnconfiguredCrmClient.js';
import { LeadService } from './services/LeadService.js';
import { LeadStore } from './services/LeadStore.js';

let dir: string;
let leadsFilePath: string;
let app: ReturnType<typeof createApp>;

beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'nfcr-app-'));
  leadsFilePath = join(dir, 'leads.jsonl');
  const leadService = new LeadService(() => new UnconfiguredCrmClient(), new LeadStore(leadsFilePath), logger);
  app = createApp(leadService);
});

afterAll(async () => {
  await rm(dir, { recursive: true, force: true });
});

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    submissionId: `01991ad8-6682-7ab1-b840-${Math.random().toString(16).slice(2, 14).padEnd(12, '0')}`,
    establishmentName: 'Boulangerie Saint-Antoine',
    city: 'Lyon',
    activity: 'Boulangerie',
    firstName: 'Camille',
    lastName: 'Moreau',
    phone: '0674321985',
    email: 'camille.moreau@gmail.com',
    website: '',
    companyWebsiteHp: '',
    formRenderedAt: new Date(Date.now() - 5000).toISOString(),
    attribution: {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
      gclid: null,
      gbraid: null,
      wbraid: null,
      fbclid: null,
      msclkid: null,
      landing_page: 'https://nfcretail.com/fr/visibilite',
      landing_path: '/fr/visibilite',
      referrer: '',
      landing_timestamp: new Date().toISOString(),
    },
    consent: {
      noticeVersion: '2026-09-01',
      marketingConsent: true,
      marketingConsentAt: new Date().toISOString(),
    },
    ...overrides,
  };
}

async function getCsrf() {
  const agent = request.agent(app);
  const res = await agent.get('/api/csrf-token');
  return { agent, csrfToken: res.body.csrfToken as string };
}

describe('GET /api/health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});

describe('POST /api/fr/visibilite/lead', () => {
  it('rejects a submission with no CSRF token', async () => {
    const res = await request(app).post('/api/fr/visibilite/lead').send(validPayload());
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('invalid_csrf_token');
  });

  it('accepts a valid submission with a matching CSRF token, stored pending (no CRM configured)', async () => {
    const { agent, csrfToken } = await getCsrf();
    const res = await agent
      .post('/api/fr/visibilite/lead')
      .set('X-CSRF-Token', csrfToken)
      .send(validPayload({ establishmentName: 'Valid Submission Marker' }));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, status: 'pending' });

    const stored = await readFile(leadsFilePath, 'utf8');
    expect(stored).toContain('Valid Submission Marker');
  });

  it('rejects a submission without marketing consent and never stores it', async () => {
    const { agent, csrfToken } = await getCsrf();
    const res = await agent
      .post('/api/fr/visibilite/lead')
      .set('X-CSRF-Token', csrfToken)
      .send(
        validPayload({
          establishmentName: 'NO CONSENT MARKER',
          consent: { noticeVersion: '2026-09-01', marketingConsent: false, marketingConsentAt: new Date().toISOString() },
        }),
      );

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('consent_required');

    const stored = await readFile(leadsFilePath, 'utf8').catch(() => '');
    expect(stored).not.toContain('NO CONSENT MARKER');
  });

  it('rejects an invalid phone number', async () => {
    const { agent, csrfToken } = await getCsrf();
    const res = await agent
      .post('/api/fr/visibilite/lead')
      .set('X-CSRF-Token', csrfToken)
      .send(validPayload({ phone: 'abc' }));
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('invalid_phone');
  });

  it('rejects an implausible website when one is provided', async () => {
    const { agent, csrfToken } = await getCsrf();
    const res = await agent
      .post('/api/fr/visibilite/lead')
      .set('X-CSRF-Token', csrfToken)
      .send(validPayload({ website: 'not a url' }));
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('invalid_website');
  });

  it('rejects a payload missing required fields before it ever reaches spam/CRM logic', async () => {
    const { agent, csrfToken } = await getCsrf();
    const res = await agent
      .post('/api/fr/visibilite/lead')
      .set('X-CSRF-Token', csrfToken)
      .send(validPayload({ establishmentName: '' }));
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('invalid_input');
  });

  it('answers like a success but never stores a lead when the honeypot is filled', async () => {
    const { agent, csrfToken } = await getCsrf();
    const res = await agent
      .post('/api/fr/visibilite/lead')
      .set('X-CSRF-Token', csrfToken)
      .send(
        validPayload({
          establishmentName: 'SPAM MARKER SHOULD NOT BE STORED',
          companyWebsiteHp: 'http://spam.example',
        }),
      );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });

    const stored = await readFile(leadsFilePath, 'utf8').catch(() => '');
    expect(stored).not.toContain('SPAM MARKER');
  });

  it('answers like a success but never stores a lead submitted faster than a human could fill the form', async () => {
    const { agent, csrfToken } = await getCsrf();
    const res = await agent
      .post('/api/fr/visibilite/lead')
      .set('X-CSRF-Token', csrfToken)
      .send(
        validPayload({
          establishmentName: 'TOO FAST MARKER SHOULD NOT BE STORED',
          formRenderedAt: new Date().toISOString(),
        }),
      );

    expect(res.status).toBe(200);
    const stored = await readFile(leadsFilePath, 'utf8').catch(() => '');
    expect(stored).not.toContain('TOO FAST MARKER');
  });

  it('never leaks a stack trace or internal error details', async () => {
    const res = await request(app).post('/api/fr/visibilite/lead').send(validPayload());
    expect(res.body).not.toHaveProperty('stack');
    expect(JSON.stringify(res.body)).not.toMatch(/\.(ts|js):\d+/);
  });
});

describe('multi-market routing', () => {
  it('accepts leads for other supported markets on their own route', async () => {
    const { agent, csrfToken } = await getCsrf();
    const res = await agent
      .post('/api/ma/visibilite/lead')
      .set('X-CSRF-Token', csrfToken)
      .send(validPayload({ establishmentName: 'Casablanca Marker' }));

    expect(res.status).toBe(200);
    const stored = (await readFile(leadsFilePath, 'utf8'))
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));
    const record = stored.find((lead) => lead.establishmentName === 'Casablanca Marker');
    expect(record?.market).toBe('ma');
  });

  it('rejects an unsupported market code before touching CSRF/CRM logic', async () => {
    const res = await request(app).post('/api/xx/visibilite/lead').send(validPayload());
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'unsupported_market' });
  });
});

describe('unknown routes', () => {
  it('returns a clean 404 json body', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'not_found' });
  });
});
