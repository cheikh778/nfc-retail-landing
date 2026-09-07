import { describe, expect, it } from 'vitest';
import { validateStep1, validateStep2 } from '@/lib/validation';

describe('validateStep1', () => {
  it('flags all required fields when empty', () => {
    const errors = validateStep1({ establishmentName: '', city: '', activity: '' });
    expect(errors).toEqual({
      establishmentName: 'required',
      city: 'required',
      activity: 'required',
    });
  });

  it('passes with all fields filled', () => {
    const errors = validateStep1({
      establishmentName: 'Boulangerie Saint-Antoine',
      city: 'Lyon',
      activity: 'Boulangerie',
    });
    expect(errors).toEqual({});
  });

  it('treats whitespace-only input as empty', () => {
    const errors = validateStep1({ establishmentName: '   ', city: 'Lyon', activity: 'Boulangerie' });
    expect(errors.establishmentName).toBe('required');
  });
});

describe('validateStep2', () => {
  const valid = {
    firstName: 'Camille',
    lastName: 'Moreau',
    phone: '0674321985',
    email: 'camille.moreau@gmail.com',
    website: '',
  };

  it('passes with required fields filled and website empty', () => {
    expect(validateStep2(valid)).toEqual({});
  });

  it('flags missing required fields', () => {
    const errors = validateStep2({ ...valid, firstName: '', phone: '' });
    expect(errors.firstName).toBe('required');
    expect(errors.phone).toBe('required');
  });

  it('flags an invalid email distinctly from a missing one', () => {
    expect(validateStep2({ ...valid, email: '' }).email).toBe('required');
    expect(validateStep2({ ...valid, email: 'not-an-email' }).email).toBe('invalid_email');
  });

  it('flags an invalid phone', () => {
    expect(validateStep2({ ...valid, phone: 'abc' }).phone).toBe('invalid_phone');
  });

  it('leaves website optional but validates it when provided', () => {
    expect(validateStep2({ ...valid, website: '' }).website).toBeUndefined();
    expect(validateStep2({ ...valid, website: 'example.fr' }).website).toBeUndefined();
    expect(validateStep2({ ...valid, website: 'not a url' }).website).toBe('invalid_website');
  });
});
