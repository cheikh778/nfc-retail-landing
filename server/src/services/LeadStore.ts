import { mkdir, appendFile, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { StoredLead } from '../types/lead.js';

/**
 * Minimal local fallback store (JSON Lines) — brief §15/§34: never lose a
 * lead silently when the CRM is unavailable or not yet configured, and
 * allow a later replay once it is. Not a database: fine for V1 volume, and
 * trivial to point a future replay job at — see services/replayPendingLeads.ts.
 */
export class LeadStore {
  constructor(private readonly filePath: string) {}

  async save(lead: StoredLead): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    await appendFile(this.filePath, `${JSON.stringify(lead)}\n`, 'utf8');
  }

  async readAll(): Promise<StoredLead[]> {
    let raw: string;
    try {
      raw = await readFile(this.filePath, 'utf8');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw error;
    }
    return raw
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => JSON.parse(line) as StoredLead);
  }

  /** Rewrites the whole file — used by the replay job to flip replayed leads to "sent". */
  async rewriteAll(leads: StoredLead[]): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    const content = leads.map((lead) => JSON.stringify(lead)).join('\n');
    await writeFile(this.filePath, leads.length ? `${content}\n` : '', 'utf8');
  }
}
