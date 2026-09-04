const MIN_FORM_FILL_MS = 2000;

interface SpamCheckInput {
  companyWebsiteHp: string;
  formRenderedAt: string;
}

/**
 * Honeypot + time-trap (brief §13/§35). A filled honeypot or a submission
 * faster than a human could plausibly fill the form both indicate a bot.
 * Callers should respond as if the submission succeeded either way — never
 * tip off the bot that it was caught.
 */
export function isLikelySpam(input: SpamCheckInput): boolean {
  if (input.companyWebsiteHp.trim()) return true;

  const renderedAt = Date.parse(input.formRenderedAt);
  if (Number.isNaN(renderedAt)) return false;
  return Date.now() - renderedAt < MIN_FORM_FILL_MS;
}
