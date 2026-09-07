import { captureAttribution, getStoredAttribution } from './utm';
import type { ConsentData, LeadFormData, LeadSubmissionPayload } from '../types/lead';

// `||` (not `??`): an empty VITE_API_BASE_URL — e.g. a blank line in a local
// .env — must still fall back to the dev proxy path, not blank out the URL.
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '/api';

export class LeadSubmissionError extends Error {}

let csrfTokenPromise: Promise<string> | null = null;

async function fetchCsrfToken(): Promise<string> {
  const res = await fetch(`${API_BASE}/csrf-token`, { credentials: 'include' });
  if (!res.ok) throw new LeadSubmissionError('csrf_fetch_failed');
  const data = (await res.json()) as { csrfToken: string };
  return data.csrfToken;
}

function getCsrfToken(): Promise<string> {
  if (!csrfTokenPromise) {
    csrfTokenPromise = fetchCsrfToken().catch((err: unknown) => {
      csrfTokenPromise = null;
      throw err;
    });
  }
  return csrfTokenPromise;
}

interface LeadSubmissionMeta {
  formRenderedAt: string;
  submissionId: string;
  consent: ConsentData;
}

export async function submitLead(market: string, data: LeadFormData, meta: LeadSubmissionMeta): Promise<void> {
  const attribution = getStoredAttribution() ?? captureAttribution();
  const payload: LeadSubmissionPayload = {
    ...data,
    attribution,
    formRenderedAt: meta.formRenderedAt,
    submissionId: meta.submissionId,
    consent: meta.consent,
  };
  const csrfToken = await getCsrfToken();

  const res = await fetch(`${API_BASE}/${market}/visibilite/lead`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new LeadSubmissionError('lead_submission_failed');
  }
}
