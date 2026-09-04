import { mkdir, appendFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { StoredLead } from '../types/lead.js';

/**
 * Minimal local fallback store (JSON Lines) — brief §15/§34: never lose a
 * lead silently when the CRM is unavailable or not yet configured, and
 * allow a later replay once it is. Not a database: fine for V1 volume, and
 * trivial to point a future replay job at.
 */
export class LeadStore {
  constructor(private readonly filePath: string) {}

  async save(lead: StoredLead): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    await appendFile(this.filePath, `${JSON.stringify(lead)}\n`, 'utf8');
  }
}
