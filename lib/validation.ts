import { isValidPhone } from './phone';
import { isValidWebsite } from './url';
import type { LeadStep1, LeadStep2 } from '@/types/lead';

export type FieldErrorCode = 'required' | 'invalid_email' | 'invalid_phone' | 'invalid_website';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function required(value: string): FieldErrorCode | undefined {
  return value.trim() ? undefined : 'required';
}

export function validateStep1(data: LeadStep1): Partial<Record<keyof LeadStep1, FieldErrorCode>> {
  const errors: Partial<Record<keyof LeadStep1, FieldErrorCode>> = {};
  const establishmentError = required(data.establishmentName);
  const cityError = required(data.city);
  const activityError = required(data.activity);
  if (establishmentError) errors.establishmentName = establishmentError;
  if (cityError) errors.city = cityError;
  if (activityError) errors.activity = activityError;
  return errors;
}

/** Fields collected by the single-step poster form. */
export interface LeadFields {
  establishmentName: string;
  city: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export function validateLead(data: LeadFields): Partial<Record<keyof LeadFields, FieldErrorCode>> {
  const errors: Partial<Record<keyof LeadFields, FieldErrorCode>> = {};

  for (const field of ['establishmentName', 'city', 'firstName', 'lastName', 'email', 'phone'] as const) {
    const missing = required(data[field]);
    if (missing) errors[field] = missing;
  }

  if (!errors.email && !EMAIL_RE.test(data.email.trim())) {
    errors.email = 'invalid_email';
  }
  if (!errors.phone && !isValidPhone(data.phone)) {
    errors.phone = 'invalid_phone';
  }

  return errors;
}

export function validateStep2(
  data: Omit<LeadStep2, 'companyWebsiteHp'>,
): Partial<Record<keyof Omit<LeadStep2, 'companyWebsiteHp'>, FieldErrorCode>> {
  const errors: Partial<Record<keyof Omit<LeadStep2, 'companyWebsiteHp'>, FieldErrorCode>> = {};

  const firstNameError = required(data.firstName);
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = required(data.lastName);
  if (lastNameError) errors.lastName = lastNameError;

  const phoneRequiredError = required(data.phone);
  if (phoneRequiredError) {
    errors.phone = phoneRequiredError;
  } else if (!isValidPhone(data.phone)) {
    errors.phone = 'invalid_phone';
  }

  const emailRequiredError = required(data.email);
  if (emailRequiredError) {
    errors.email = emailRequiredError;
  } else if (!EMAIL_RE.test(data.email.trim())) {
    errors.email = 'invalid_email';
  }

  if (data.website.trim() && !isValidWebsite(data.website)) {
    errors.website = 'invalid_website';
  }

  return errors;
}
