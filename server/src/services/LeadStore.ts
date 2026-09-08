import { mkdir, appendFile, chmod, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { StoredLead } from '../types/lead.js';

/**
 * Minimal local fallback store (JSON Lines) — brief §15/§34: never lose a
 * lead silently when the CRM is unavailable or not yet configured, and
 * allow a later replay once it is. Not a database: fine for V1 volume, and
 * trivial to point a future replay job at — see services/replayPendingLeads.ts.
 *
 * The file holds contact PII, so it is written owner-only (dir 0700, file
 * 0600) and must stay off git and out of any deploy bundle (see .gitignore
 * and the rsync `--exclude=data` in .github/workflows/deploy-api.yml).
 */
const DIR_MODE = 0o700;
const FILE_MODE = 0o600;

export class LeadStore {
  constructor(private readonly filePath: string) {}

  private async ensureDir(): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true, mode: DIR_MODE });
  }

  /** Best-effort tightening of the file's mode — `appendFile`'s mode only applies on creation. */
  private async tightenFileMode(): Promise<void> {
    try {
      await chmod(this.filePath, FILE_MODE);
    } catch {
      // Some hosts (or a mounted volume) disallow chmod — the umask default
      // still applies. Not worth failing a lead capture over.
    }
  }

  async save(lead: StoredLead): Promise<void> {
    await this.ensureDir();
    await appendFile(this.filePath, `${JSON.stringify(lead)}\n`, { encoding: 'utf8', mode: FILE_MODE });
    await this.tightenFileMode();
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
    await this.ensureDir();
    const content = leads.map((lead) => JSON.stringify(lead)).join('\n');
    await writeFile(this.filePath, leads.length ? `${content}\n` : '', { encoding: 'utf8', mode: FILE_MODE });
    await this.tightenFileMode();
  }
}
