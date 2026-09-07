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
    subtitle: string;
    ctaPrimaryLabel: string;
    ctaSecondaryLabel: string;
    reassurance: string[];
    preview: {
      browserBar: string;
      dashboardSrc: string;
      dashboardAlt: string;
      statVisibiliteLabel: string;
      statVisibiliteValue: string;
      statAvisLabel: string;
      statAvisValue: string;
    };
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
