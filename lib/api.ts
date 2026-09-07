import { captureAttribution, getStoredAttribution } from './utm';
import type { ConsentData, LeadFormData, LeadSubmissionPayload } from '@/types/lead';

/*
 * Lead submission → external Symfony API (separate repo).
 *
 * TODO (à caler avec le repo Symfony avant la mise en production) :
 *   - chemin exact de l'endpoint (ici : POST {base}/fr/visibilite/lead)
 *   - authentification : aucune / clé API en header / cookie same-site
 *   - format de réponse (204 ? { id } ? { status } ?)
 *   - gestion de l'idempotence via `submissionId` (rejeu après échec réseau)
 *
 * La partie CSRF / anti-spam / validation serveur qui vivait dans l'ancien
 * dossier server/ est désormais de la responsabilité de l'API Symfony.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? '';
const LEAD_ENDPOINT = '/fr/visibilite/lead';

export class LeadSubmissionError extends Error {}

interface LeadSubmissionMeta {
  formRenderedAt: string;
  submissionId: string;
  consent: ConsentData;
}

export async function submitLead(data: LeadFormData, meta: LeadSubmissionMeta): Promise<void> {
  if (!API_BASE) {
    console.warn(
      '[api] NEXT_PUBLIC_API_BASE_URL is not set — cannot submit the lead. ' +
        'Set it to the Symfony API base URL (see .env.example).',
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

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${LEAD_ENDPOINT}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (cause) {
    throw new LeadSubmissionError('network_error', { cause });
  }

  if (!res.ok) {
    throw new LeadSubmissionError(`lead_submission_failed_${res.status}`);
  }
}
