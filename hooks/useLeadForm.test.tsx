import { act, renderHook, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { FormEvent } from 'react';
import { useLeadForm } from './useLeadForm';

const mocks = vi.hoisted(() => ({ submitLead: vi.fn(), push: vi.fn(), track: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mocks.push }) }));
vi.mock('@/lib/api', () => ({ submitLead: mocks.submitLead }));
vi.mock('@/lib/tracking', () => ({ track: mocks.track }));

const event = { preventDefault: vi.fn() } as unknown as FormEvent;

async function readyForm() {
  const hook = renderHook(() => useLeadForm());
  act(() => {
    hook.result.current.updateField('establishmentName', 'Boulangerie');
    hook.result.current.updateField('city', 'Lyon');
    hook.result.current.updateField('firstName', 'Camille');
    hook.result.current.updateField('lastName', 'Moreau');
    hook.result.current.updateField('email', 'camille@example.com');
    hook.result.current.updateField('phone', '0674321985');
  });
  return hook;
}

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

describe('submission conversion', () => {
  it('keeps a captured lead locked while navigation is pending', async () => {
    mocks.submitLead.mockResolvedValue(undefined);
    const { result } = await readyForm();
    await act(() => result.current.submit(event));
    expect(result.current.submitting).toBe(true);
    await act(() => result.current.submit(event));
    expect(mocks.submitLead).toHaveBeenCalledTimes(1);
    expect(mocks.track.mock.calls.filter(([name]) => name === 'generate_lead')).toHaveLength(1);
  });

  it('unlocks for retry after failure without counting a lead', async () => {
    mocks.submitLead.mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce(undefined);
    const { result } = await readyForm();
    await act(() => result.current.submit(event));
    expect(result.current.submitting).toBe(false);
    expect(result.current.submitError).toBe(true);
    expect(mocks.track.mock.calls.filter(([name]) => name === 'generate_lead')).toHaveLength(0);
    await act(() => result.current.submit(event));
    expect(mocks.submitLead).toHaveBeenCalledTimes(2);
    expect(mocks.track.mock.calls.filter(([name]) => name === 'generate_lead')).toHaveLength(1);
  });
});
