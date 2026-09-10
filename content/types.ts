/**
 * Shape of the France landing content. V1 is FR-only; a second market would
 * add another file satisfying this interface, not a component rewrite.
 *
 * The landing reproduces the validated France mock: header → hero (copy +
 * Google/ChatGPT discovery scene on the left, lead form on the right) → trust
 * bar, plus a mobile sticky CTA.
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
    brandStrong: string;
    brandRest: string;
    brandTagline: string;
    /** Engine chips on the right of the header. */
    channels: string[];
    /** Two-line growth line after the divider. */
    growth: [string, string];
    countryLabel: string;
  };

  hero: {
    eyebrow: string;
    h1Line1: string;
    /** Second line of the h1, shown in flame red. */
    h1Line2: string;
    /** Bold "Sur Google. Sur ChatGPT…" line is rendered with logos in Hero.tsx. */
    sublead: string;
    /** 4-up value props. */
    benefits: { title: string; sub: string }[];
    /** Hand-written notes on the discovery scene. */
    scribbles: { left: string; right: string };
  };

  form: {
    /** "Découvrez si vos clients peuvent vous trouver sur " + engine word. */
    titleLead: string;
    /** Default engine word (with trailing dot), e.g. "CHATGPT." */
    engineDefault: string;
    subtitle: string;
    fields: {
      establishmentLabel: string;
      establishmentPlaceholder: string;
      cityLabel: string;
      cityPlaceholder: string;
      firstNameLabel: string;
      firstNamePlaceholder: string;
      lastNameLabel: string;
      lastNamePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      phoneLabel: string;
      phonePlaceholder: string;
    };
    submitLabel: string;
    microProof: string[];
    privacy: string;
    /** Implicit-consent line shown under the submit button (no visible checkbox). */
    consent: {
      before: string;
      linkLabel: string;
      after: string;
    };
    errors: {
      required: string;
      email: string;
      phone: string;
    };
    submitError: string;
  };

  trust: {
    establishments: string;
    ratingScore: string;
    ratingLabel: string;
    googlePartner: string;
    rgpd: string;
    madeInFrance: string;
  };

  mobileCtaLabel: string;

  /** Privacy notice metadata sent with every lead (CRM `consent.notice_version`). */
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

  /** A legal page's body: a list of sections, each with a heading and one or more paragraphs. */
  legal: {
    mentionsLegales: LegalDocument;
    politiqueConfidentialite: LegalDocument;
  };
}

export interface LegalDocument {
  lastUpdated: string;
  sections: { heading: string; paragraphs: string[]; list?: string[] }[];
}
