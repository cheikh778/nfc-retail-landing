import { describe, expect, it, vi } from 'vitest';
import type { CRMLeadRecord } from '../../types/lead.js';
import { CrmConflictError, CrmRequestError } from './CrmClient.js';
import { HttpCrmClient } from './HttpCrmClient.js';

const lead: CRMLeadRecord = {
  id: 'internal-1',
  submissionId: '01991ad8-6682-7ab1-b840-f42c3ce971de',
  market: 'fr',
  establishmentName: 'Moreau Conseil',
  city: 'Paris',
  activity: 'Conseil',
  firstName: 'Camille',
  lastName: 'Moreau',
  phone: '+33674321985',
  email: 'camille.moreau@gmail.com',
  website: 'https://moreau-conseil.fr',
  attribution: {
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'france_visibilite',
    utm_content: 'annonce_a',
    utm_term: 'agence digitale',
    gclid: 'clic-google',
    gbraid: null,
    wbraid: null,
    fbclid: null,
    msclkid: null,
    landing_page: 'https://nfcretail.com/fr/visibilite?utm_source=google',
    landing_path: '/fr/visibilite',
    referrer: 'https://www.google.com/',
    landing_timestamp: '2026-09-05T07:29:00.000Z',
  },
  consent: {
    noticeVersion: '2026-09-01',
    marketingConsent: true,
    marketingConsentAt: '2026-09-05T09:30:00+02:00',
  },
  receivedAt: '2026-09-05T07:30:00.000Z',
};

function client(fetchImpl: typeof fetch, overrides: Partial<ConstructorParameters<typeof HttpCrmClient>[0]> = {}) {
  return new HttpCrmClient({
    apiUrl: 'https://up.moncrm.io/api/v1/leads',
    apiKey: 'secret-key',
    locale: 'fr-FR',
    offerCode: 'visibilite',
    fetchImpl,
    maxRetries: 2,
    ...overrides,
  });
}

const okResponse = (status = 201) => new Response(null, { status });

describe('HttpCrmClient', () => {
  it('POSTs the contract payload with Bearer auth and Idempotency-Key = submissionId', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(okResponse(201));
    await client(fetchMock).createLead(lead);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://up.moncrm.io/api/v1/leads');
    const headers = init!.headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer secret-key');
    expect(headers['Idempotency-Key']).toBe(lead.submissionId);
    expect(headers['Content-Type']).toBe('application/json');

    const body = JSON.parse(init!.body as string);
    expect(body).toMatchObject({
      submission_id: lead.submissionId,
      locale: 'fr-FR',
      offer_code: 'visibilite',
      contact: { first_name: 'Camille', last_name: 'Moreau', email: lead.email, phone: lead.phone },
      privacy: { notice_version: '2026-09-01', marketing_consent: true, marketing_consent_at: '2026-09-05T09:30:00+02:00' },
      attribution: { utm_source: 'google', utm_term: 'agence digitale', gclid: 'clic-google' },
      submitted_at: lead.receivedAt,
    });
    expect(body).not.toHaveProperty('market_code');
  });

  it('treats 200 (already received) as success', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(okResponse(200));
    await expect(client(fetchMock).createLead(lead)).resolves.toBeUndefined();
  });

  it('retries on a 5xx and succeeds, reusing the same Idempotency-Key', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(okResponse(201));

    await client(fetchMock, { maxRetries: 1 }).createLead(lead);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const keys = fetchMock.mock.calls.map((c) => (c[1]!.headers as Record<string, string>)['Idempotency-Key']);
    expect(new Set(keys)).toEqual(new Set([lead.submissionId]));
  });

  it('retries on a network error then throws a retryable CrmRequestError', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockRejectedValue(new Error('ECONNRESET'));
    const err = await client(fetchMock, { maxRetries: 1 }).createLead(lead).catch((e) => e);
    expect(err).toBeInstanceOf(CrmRequestError);
    expect(err.retryable).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not retry a 422 and throws a non-retryable error', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 422 }));
    const err = await client(fetchMock).createLead(lead).catch((e) => e);
    expect(err).toBeInstanceOf(CrmRequestError);
    expect(err.status).toBe(422);
    expect(err.retryable).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('maps 409 to CrmConflictError without retrying', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 409 }));
    const err = await client(fetchMock).createLead(lead).catch((e) => e);
    expect(err).toBeInstanceOf(CrmConflictError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
