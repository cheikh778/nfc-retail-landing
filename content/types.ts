/**
 * Shape of the France landing content. V1 is FR-only; a second market would
 * add another file satisfying this interface, not a component rewrite.
 */
export interface LandingContent {
  locale: string;

  meta: {
    title: string;
    description: string;
    canonicalUrl: string;
    robots: 'index, follow' | 'noindex, follow';
    ogImage: string;
  };

  header: {
    logoSrc: string;
    logoAlt: string;
  };

  hero: {
    chips: string[];
    h1: string;
    /** The word inside h1 that gets the flame highlight. */
    h1Highlight: string;
    /** Bold lead line under the h1. */
    subtitle: string;
    /** Supporting paragraph under the lead line. */
    body: string;
    ctaPrimaryLabel: string;
    /** Fragment id (without #) the hero CTA scrolls to. */
    formAnchor: string;
    reassurance: string[];
    /** Solocal-style "visibility score" gauge with the search/AI engines on an arc. */
    gauge: {
      /** 0–100, drives the needle + coloured arc. */
      score: number;
      scoreLabel: string;
      caption: string;
      /** Logos placed along the gauge arc — order = left→right. */
      engines: { src: string; alt: string }[];
    };
    /** Real product screenshots — 3 phones on desktop, shots[0] alone on mobile. */
    showcase: {
      shots: { src: string; alt: string; caption: string }[];
    };
  };

  /** Section 2 of the brief — the "piloté pour vous" steps, folded around the gauge. */
  journey: {
    title: string;
    subtitle: string;
    /** Each step is an accordion card; opening it shows `image` in the visual panel. */
    steps: { label: string; detail: string; image: string; imageAlt: string }[];
    /** The pay-off step, rendered as the highlighted end. */
    outcome: string;
  };

  modal: {
    closeLabel: string;
    stepIndicator: (step: 1 | 2) => string;
    step1: {
      establishmentLabel: string;
      establishmentPlaceholder: string;
      cityLabel: string;
      cityPlaceholder: string;
      activityLabel: string;
      activityPlaceholder: string;
      ctaLabel: string;
    };
    step2: {
      backLabel: string;
      firstNameLabel: string;
      firstNamePlaceholder: string;
      lastNameLabel: string;
      lastNamePlaceholder: string;
      phoneLabel: string;
      phonePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      websiteLabel: string;
      websitePlaceholder: string;
      websiteOptionalHint: string;
      ctaLabel: string;
    };
    consent: {
      before: string;
      linkLabel: string;
      after: string;
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
    title: (firstName?: string) => string;
    body: (establishmentName?: string) => string;
    nextStepsTitle: string;
    nextSteps: string[];
    backHomeLabel: string;
  };

  footer: {
    logoAlt: string;
    tagline: string;
    links: { label: string; href: string; external?: boolean }[];
    manageCookiesLabel: string;
    copyright: string;
  };

  legalPlaceholder: {
    body: string;
  };
}
