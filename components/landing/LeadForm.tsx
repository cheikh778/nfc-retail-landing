'use client';

import { useEffect, useId, useState } from 'react';
import { ArrowRight, Check, Lock, Mail, MapPin, Phone, Store, User } from 'lucide-react';
import type { LandingContent } from '@/content/types';
import { useLeadForm } from '@/hooks/useLeadForm';
import { PATHS } from '@/lib/paths';
import type { LeadFields } from '@/lib/validation';

interface Props {
  content: LandingContent['form'];
}

type Engine = { word: string; color: string };

/** Mirrors the mock's app.js: the form title adapts to the campaign source. */
function useEngine(fallback: string): Engine {
  const [engine, setEngine] = useState<Engine>({ word: fallback, color: 'var(--green)' });

  useEffect(() => {
    let source = '';
    try {
      source = (new URLSearchParams(window.location.search).get('utm_source') ?? '').toLowerCase();
    } catch {
      source = '';
    }
    if (source.includes('google')) {
      setEngine({ word: 'GOOGLE.', color: 'var(--blue)' });
    } else if (source.includes('gpt') || source.includes('openai') || source.includes('chatgpt')) {
      setEngine({ word: 'CHATGPT.', color: 'var(--green)' });
    }
  }, []);

  return engine;
}

export function LeadForm({ content }: Props) {
  const form = useLeadForm();
  const uid = useId();
  const engine = useEngine(content.engineDefault);

  const hasErrors = Object.keys(form.errors).length > 0;
  const message = form.submitError ? content.submitError : hasErrors ? content.errors.required : '';

  const fieldProps = (name: keyof LeadFields, autoComplete: string) => ({
    id: `${uid}-${name}`,
    name,
    'data-testid': `field-${name.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
    value: form.values[name],
    autoComplete,
    'aria-invalid': form.errors[name] ? true : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => form.updateField(name, e.target.value),
  });

  const fieldClass = (name: keyof LeadFields) => `field${form.errors[name] ? ' invalid' : ''}`;

  return (
    <aside className="lead-card" id="diagnostic">
      <div className="form-heading">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="chatgpt-mark" src="/assets/landing/fr/chatgpt.svg" alt="ChatGPT" />
        <h2>
          {content.titleLead.replace(/\s+$/, '')}{' '}
          <span style={{ color: engine.color }}>{engine.word}</span>
        </h2>
      </div>
      <p>{content.subtitle}</p>

      <form id="leadForm" onSubmit={form.submit} noValidate data-testid="lead-form">
        <label htmlFor={`${uid}-establishmentName`}>
          {content.fields.establishmentLabel} <span className="req">*</span>
          <span className={fieldClass('establishmentName')}>
            <span className="field-icon" aria-hidden>
              <Store />
            </span>
            <input {...fieldProps('establishmentName', 'organization')} placeholder={content.fields.establishmentPlaceholder} />
          </span>
        </label>

        <label htmlFor={`${uid}-city`}>
          {content.fields.cityLabel} <span className="req">*</span>
          <span className={fieldClass('city')}>
            <span className="field-icon" aria-hidden>
              <MapPin />
            </span>
            <input {...fieldProps('city', 'address-level2')} placeholder={content.fields.cityPlaceholder} />
          </span>
        </label>

        <div className="two-cols">
          <label htmlFor={`${uid}-firstName`}>
            {content.fields.firstNameLabel} <span className="req">*</span>
            <span className={fieldClass('firstName')}>
              <span className="field-icon" aria-hidden>
                <User />
              </span>
              <input {...fieldProps('firstName', 'given-name')} placeholder={content.fields.firstNamePlaceholder} />
            </span>
          </label>
          <label htmlFor={`${uid}-lastName`}>
            {content.fields.lastNameLabel} <span className="req">*</span>
            <span className={fieldClass('lastName')}>
              <input {...fieldProps('lastName', 'family-name')} placeholder={content.fields.lastNamePlaceholder} />
            </span>
          </label>
        </div>

        <label htmlFor={`${uid}-email`}>
          {content.fields.emailLabel} <span className="req">*</span>
          <span className={fieldClass('email')}>
            <span className="field-icon" aria-hidden>
              <Mail />
            </span>
            <input {...fieldProps('email', 'email')} type="email" inputMode="email" placeholder={content.fields.emailPlaceholder} />
          </span>
        </label>

        <label htmlFor={`${uid}-phone`}>
          {content.fields.phoneLabel} <span className="req">*</span>
          <span className={fieldClass('phone')}>
            <span className="field-icon" aria-hidden>
              <Phone />
            </span>
            <input {...fieldProps('phone', 'tel')} type="tel" inputMode="tel" placeholder={content.fields.phonePlaceholder} />
          </span>
        </label>

        {/* Honeypot — invisible to real users. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="company_website">Ne pas remplir ce champ</label>
          <input
            id="company_website"
            name="company_website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.honeypot}
            onChange={(e) => form.setHoneypot(e.target.value)}
          />
        </div>

        {/* Consent is implicit — submitting the form is the opt-in. Hidden,
            pre-checked box kept for form semantics / the payload trail. */}
        <input
          type="checkbox"
          name="consent"
          data-testid="field-consent"
          defaultChecked
          hidden
          readOnly
          aria-hidden
          tabIndex={-1}
        />

        <button type="submit" data-testid="lead-submit" disabled={form.submitting}>
          {form.submitting ? '…' : content.submitLabel}
          <ArrowRight aria-hidden />
        </button>

        <div className="micro-proof">
          {content.microProof.map((item) => (
            <span key={item}>
              <Check strokeWidth={3} aria-hidden />
              {item}
            </span>
          ))}
        </div>

        <small className="privacy">
          <Lock aria-hidden />
          {content.privacy}
        </small>

        <p className="consent-note">
          {content.consent.before}
          <a href={PATHS.politiqueConfidentialite} target="_blank" rel="noopener noreferrer">
            {content.consent.linkLabel}
          </a>
          {content.consent.after}
        </p>

        <div
          className={`form-message${message ? ' error' : ''}`}
          role="status"
          aria-live="polite"
          data-testid={form.submitError ? 'submit-error' : 'form-message'}
        >
          {message}
        </div>
      </form>
    </aside>
  );
}
