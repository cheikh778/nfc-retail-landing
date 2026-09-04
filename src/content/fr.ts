import type { LandingContent } from './types';

/**
 * V1 France content for /fr/visibilite.
 * Texts marked "exact" in the brief are copied verbatim — do not rephrase
 * them without checking with marketing.
 */
export const fr: LandingContent = {
  locale: 'fr-FR',
  direction: 'ltr',

  meta: {
    title: 'NFC Retail — Améliorez la visibilité de votre établissement',
    description:
      'Analysez gratuitement la visibilité de votre établissement sur Google, ChatGPT et les nouveaux moteurs IA avec NFC Retail.',
    canonicalUrl: 'https://nfcretail.com/fr/visibilite',
    // Ads-only landing: default to noindex until marketing/SEO confirms otherwise (brief §29).
    robots: 'noindex, follow',
  },

  header: {
    logoSrc: '/assets/landing/fr/logo.svg',
    logoAlt: 'NFC Retail',
    anchorLabel: 'Comment ça marche',
    anchorHref: '#parcours',
    ctaLabel: 'AUDIT GRATUIT',
    ctaHref: '#diagnostic',
  },

  hero: {
    h1: 'Vos futurs clients vous trouvent-ils vraiment ?',
    h2: 'Soyez visible là où vos clients vous cherchent : Google, ChatGPT et les nouveaux moteurs IA.',
    body: "NFC Retail pilote votre visibilité, votre e-réputation et votre acquisition digitale pour vous aider à attirer de nouveaux clients et développer votre chiffre d'affaires.",
    ctaLabel: 'ANALYSER GRATUITEMENT MA VISIBILITÉ',
    ctaHref: '#diagnostic',
    reassurance: 'Audit gratuit • Sans engagement • Analyse personnalisée',
    visual: {
      desktopSrc: '/assets/landing/fr/dashboard.webp',
      desktopPlaceholderSrc: '/assets/landing/fr/dashboard-placeholder.svg',
      mobileSrc: '/assets/landing/fr/dashboard-mobile.webp',
      mobilePlaceholderSrc: '/assets/landing/fr/dashboard-mobile-placeholder.svg',
      alt: 'Interface du tableau de bord NFC Retail',
      cards: [
        { label: 'Visibilité' },
        { label: 'Avis clients' },
        { label: 'Réputation' },
        { label: 'Campagnes' },
        { label: 'Acquisition' },
      ],
    },
  },

  journey: {
    eyebrow: 'Le parcours',
    title: 'Votre marketing digital piloté pour vous.',
    subtitle: "Vous gérez votre activité. NFC Retail s'occupe de votre visibilité et de votre acquisition.",
    steps: [
      { label: 'ÊTRE TROUVÉ', description: 'Google, Maps et nouveaux moteurs IA.' },
      { label: 'ÊTRE CHOISI', description: 'Avis, réputation et présence digitale.' },
      { label: 'ATTIRER', description: 'Acquisition et campagnes.' },
      { label: 'FIDÉLISER', description: 'Données clients, WhatsApp/SMS et fidélisation.' },
      { label: 'DÉVELOPPER SON CHIFFRE D’AFFAIRES', description: '' },
    ],
  },

  automation: {
    eyebrow: 'Automatisation',
    title: 'Votre marketing travaille même quand vous ne vous en occupez pas.',
    body: "NFC Retail exploite progressivement vos données pour simplifier et automatiser le marketing de votre établissement. Certaines automatisations sont en cours de déploiement : les fonctionnalités disponibles dépendent de votre configuration.",
    flows: [
      { from: 'Avis reçu', to: 'Réponse assistée / automatisée' },
      { from: 'Données clients', to: 'Segmentation' },
      { from: 'Opportunité commerciale', to: 'Campagne' },
      { from: 'Campagne', to: 'Analyse des résultats' },
    ],
    pipeline: ['COLLECTER', 'ANALYSER', 'AGIR', 'MESURER'],
  },

  proof: {
    eyebrow: 'Preuves',
    title: 'Ils nous font déjà confiance',
    items: [
      { kind: 'client', placeholder: '[CLIENT FR — À VALIDER]' },
      { kind: 'stat', placeholder: '[CHIFFRE CLÉ — À VALIDER]' },
      { kind: 'capture', placeholder: '[CAPTURE DASHBOARD — À FOURNIR]' },
    ],
  },

  faq: {
    eyebrow: 'Questions fréquentes',
    title: 'Ce qu’il faut savoir avant de démarrer',
    subtitle: 'Les réponses aux questions les plus courantes sur l’audit de visibilité NFC Retail.',
    items: [
      {
        question: 'L’analyse de visibilité est-elle vraiment gratuite ?',
        answer:
          'Oui. L’audit initial de votre visibilité (Google, Maps, moteurs IA) est gratuit et sans engagement.',
      },
      {
        question: 'Suis-je engagé après avoir rempli le formulaire ?',
        answer:
          'Non. Vous recevez votre diagnostic et un membre de l’équipe vous contacte pour l’expliquer — vous restez libre de donner suite ou non.',
      },
      {
        question: 'Combien de temps prend l’analyse ?',
        answer:
          'Le formulaire prend moins d’une minute. Notre équipe revient ensuite vers vous avec votre diagnostic personnalisé.',
      },
      {
        question: 'Que deviennent mes données ?',
        answer:
          'Vos informations servent uniquement à réaliser votre diagnostic et à vous recontacter. Voir notre politique de confidentialité pour le détail du traitement.',
      },
    ],
  },

  form: {
    anchorId: 'diagnostic',
    title: 'Recevez votre diagnostic de visibilité',
    subtitle: 'Deux étapes, moins d’une minute.',
    stepIndicator: (step) => `${step} / 2`,
    step1: {
      title: 'Parlez-nous de votre établissement',
      establishmentLabel: "Nom de l'établissement",
      cityLabel: 'Ville',
      activityLabel: 'Activité',
      ctaLabel: 'ANALYSER MA VISIBILITÉ',
    },
    step2: {
      title: 'Vos coordonnées',
      backLabel: 'Retour',
      firstNameLabel: 'Prénom',
      lastNameLabel: 'Nom',
      phoneLabel: 'Téléphone',
      emailLabel: 'E-mail',
      websiteLabel: 'Site internet',
      websiteOptionalHint: 'Optionnel',
      ctaLabel: 'RECEVOIR MON DIAGNOSTIC GRATUIT',
    },
    errors: {
      required: 'Ce champ est obligatoire.',
      email: 'Merci de renseigner une adresse e-mail valide.',
      phone: 'Merci de renseigner un numéro de téléphone valide.',
      website: 'Merci de renseigner une adresse de site valide.',
      generic: 'Merci de vérifier ce champ.',
    },
    submitError:
      'Une erreur temporaire est survenue. Votre demande n’a pas pu être finalisée. Merci de réessayer dans quelques instants.',
  },

  confirmation: {
    title: 'Votre demande d’analyse a bien été reçue.',
    body: 'Merci ! Un membre de l’équipe NFC Retail va étudier la visibilité de votre établissement.',
    nextStepsTitle: 'La suite',
    nextSteps: [
      'Nous analysons votre présence sur Google, Maps et les moteurs IA.',
      'Nous vous contactons pour vous présenter votre diagnostic personnalisé.',
      'Nous vous proposons un plan d’action pour développer votre visibilité.',
    ],
    backHomeLabel: 'Retour à l’accueil',
  },

  finalCta: {
    title: 'Et si vos prochains clients vous cherchaient déjà ?',
    subtitle: 'Découvrez les opportunités de visibilité de votre établissement.',
    ctaLabel: 'ANALYSER GRATUITEMENT MA VISIBILITÉ',
    ctaHref: '#diagnostic',
  },

  stickyCta: {
    label: 'ANALYSER MA VISIBILITÉ',
  },

  footer: {
    logoAlt: 'NFC Retail',
    tagline: 'Visibilité, réputation et acquisition pour les commerces de terrain.',
    legalLinks: [
      { label: 'Mentions légales', slug: 'mentions-legales' },
      { label: 'Politique de confidentialité', slug: 'politique-de-confidentialite' },
    ],
    copyright: `© ${new Date().getFullYear()} NFC Retail. Tous droits réservés.`,
  },

  legalPlaceholder: {
    title: '',
    body: 'Ce contenu doit être rédigé et validé par l’équipe juridique de NFC Retail avant la mise en production.',
  },
};
