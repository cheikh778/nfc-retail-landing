import { describe, expect, it } from 'vitest';
import { getContent } from './index';
import { fr } from './fr';

describe('getContent', () => {
  it('returns fr content for fr', () => {
    expect(getContent('fr')).toBe(fr);
  });

  it('falls back to fr content for markets without their own content yet (ma, sn)', () => {
    expect(getContent('ma')).toBe(fr);
    expect(getContent('sn')).toBe(fr);
  });

  it('falls back to fr content for an unknown market rather than throwing', () => {
    expect(getContent('xx')).toBe(fr);
  });
});
