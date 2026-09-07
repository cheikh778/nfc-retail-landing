/**
 * Shape shared by every market's landing content.
 * Only `fr` is implemented in V1 — see content/fr.ts.
 * Adding ma-fr / ma-ar / sn-fr / sn-wo later means adding a new file that
 * satisfies this interface, not rewriting the components.
 */
export interface JourneyStep {
  label: string;
  description: string;
}

export interface AutomationFlow {
  from: string;
  to: string;
}

export type ProofItemKind = 'client' | 'stat' | 'capture';

export interface ProofItem {
  kind: ProofItemKind;
  placeholder: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface LandingContent {
  locale: string;
  direction: 'ltr' | 'rtl';

  meta: {
    title: string;
    description: string;
    canonicalUrl: string;
    /** Explicit per section 29 of the brief — never decided silently. */
    robots: 'noindex, follow' | 'index, follow';
  };

  header: {
    logoSrc: string;
    logoAlt: string;
    navLinks: NavLink[];
    ctaLabel: string;
    ctaHref: string;
  };

  hero: {
    h1: string;
    h2: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
    reassurance: string[];
    visual: {
      src: string;
      alt: string;
    };
  };

  journey: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: JourneyStep[];
  };

  product: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };

  automation: {
    eyebrow: string;
    title: string;
    body: string;
    flows: AutomationFlow[];
    pipeline: string[];
  };

  proof: {
    eyebrow: string;
    title: string;
    items: ProofItem[];
  };

  faq: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { question: string; answer: string }[];
  };

  form: {
    anchorId: string;
    title: string;
    subtitle: string;
    stepIndicator: (step: 1 | 2) => string;
    step1: {
      title: string;
      establishmentLabel: string;
      cityLabel: string;
      activityLabel: string;
      ctaLabel: string;
    };
    step2: {
      title: string;
      backLabel: string;
      firstNameLabel: string;
      lastNameLabel: string;
      phoneLabel: string;
      emailLabel: string;
      websiteLabel: string;
      websiteOptionalHint: string;
      ctaLabel: string;
    };
    consent: {
      /** Text before the privacy-policy link. */
      before: string;
      /** The clickable link label pointing to the privacy policy. */
      linkLabel: string;
      /** Text after the link (may be empty). */
      after: string;
      /** Shown when the visitor tries to submit without ticking the box. */
      error: string;
    };
    errors: {
      required: string;
      email: string;
      phone: string;
      website: string;
      generic: string;
    };
    submitError: string;
  };

  /** Privacy notice metadata sent with every lead (CRM `privacy.notice_version`). */
  privacy: {
    noticeVersion: string;
  };

  confirmation: {
    /** `firstName` comes from the lead's step-2 answer, when navigation state carries it. */
    title: (firstName?: string) => string;
    body: (establishmentName?: string) => string;
    nextStepsTitle: string;
    nextSteps: string[];
    backHomeLabel: string;
  };

  finalCta: {
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
  };

  stickyCta: {
    label: string;
  };

  footer: {
    logoAlt: string;
    tagline: string;
    /** `slug` is market-relative (e.g. 'mentions-legales') — the page builds the full /:market/ path. */
    legalLinks: { label: string; slug: string }[];
    copyright: string;
  };

  legalPlaceholder: {
    title: string;
    body: string;
  };
}
