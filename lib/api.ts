import { captureAttribution, getStoredAttribution } from './utm';
import type { ConsentData, LeadFormData, LeadSubmissionPayload } from '@/types/lead';

/*
 * Lead submission → the NFC Retail lead API (this repo's `server/`, an Express
 * app deployed at NEXT_PUBLIC_API_BASE_URL — see server/ and deploy/DEPLOYMENT.md).
 *
 * Flow, all same-site (landing on nfcretail.com, API on api.nfcretail.com):
 *   1. GET  {base}/api/csrf-token        → { csrfToken }, sets a signed cookie
 *   2. POST {base}/api/{market}/visibilite/lead
 *        headers: x-csrf-token: <token from step 1>
 *        cookies: the signed CSRF cookie (credentials: 'include')
 *        body:    LeadSubmissionPayload (validated again server-side)
 *
 * The server keeps every accepted lead in a local fallback store even when the
 * CRM is down, so a 200 here means "captured", not necessarily "in the CRM yet".
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? '';

/** V1 is France-only; the market segment is what routes a lead to its CRM server-side. */
const MARKET = 'fr';

export class LeadSubmissionError extends Error {}

interface LeadSubmissionMeta {
  formRenderedAt: string;
  submissionId: string;
  consent: ConsentData;
}

async function fetchCsrfToken(): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/csrf-token`, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
  } catch (cause) {
    throw new LeadSubmissionError('network_error', { cause });
  }
  if (!res.ok) throw new LeadSubmissionError(`csrf_token_failed_${res.status}`);

  const data = (await res.json().catch(() => null)) as { csrfToken?: string } | null;
  if (!data?.csrfToken) throw new LeadSubmissionError('csrf_token_missing');
  return data.csrfToken;
}

async function postLead(payload: LeadSubmissionPayload, csrfToken: string): Promise<Response> {
  try {
    return await fetch(`${API_BASE}/api/${MARKET}/visibilite/lead`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': csrfToken,
      },
      body: JSON.stringify(payload),
    });
  } catch (cause) {
    throw new LeadSubmissionError('network_error', { cause });
  }
}

export async function submitLead(data: LeadFormData, meta: LeadSubmissionMeta): Promise<void> {
  if (!API_BASE) {
    console.warn(
      '[api] NEXT_PUBLIC_API_BASE_URL is not set — cannot submit the lead. ' +
        'Set it to the lead API base URL (see .env.example).',
    );
    throw new LeadSubmissionError('api_base_url_missing');
  }

  const attribution = getStoredAttribution() ?? captureAttribution();
  const payload: LeadSubmissionPayload = {
    ...data,
    attribution,
    formRenderedAt: meta.formRenderedAt,
    submissionId: meta.submissionId,
    consent: meta.consent,
  };

  let csrfToken = await fetchCsrfToken();
  let res = await postLead(payload, csrfToken);

  // A 403 usually means the CSRF cookie/token pair went stale (tab left open a
  // long time). Re-handshake once — the submissionId makes a retry idempotent.
  if (res.status === 403) {
    csrfToken = await fetchCsrfToken();
    res = await postLead(payload, csrfToken);
  }

  if (!res.ok) {
    throw new LeadSubmissionError(`lead_submission_failed_${res.status}`);
  }
}
