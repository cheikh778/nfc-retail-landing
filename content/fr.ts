import { SITE_URL } from '@/lib/seo';
import { PATHS } from '@/lib/paths';
import type { LandingContent } from './types';

/**
 * V1 France content for /fr/visibilite.
 * Visual copy is a 1:1 transcription of the validated France mock
 * (nfc-retail-france-landing) — do not rephrase without checking with marketing.
 */
export const fr: LandingContent = {
  locale: 'fr-FR',

  meta: {
    title: 'NFC Retail — Vos prochains clients vous cherchent déjà',
    description:
      'Découvrez si vos clients peuvent trouver votre établissement sur Google, ChatGPT et les moteurs IA. Diagnostic de visibilité gratuit, sans engagement, en moins d’une minute.',
    canonicalUrl: `${SITE_URL}${PATHS.visibilite}`,
    robots: 'index, follow',
    ogImage: '/assets/landing/fr/og-image.png',
  },

  header: {
    brandStrong: 'NFC',
    brandRest: 'RETAIL',
    brandTagline: 'BOOSTEZ VOTRE VISIBILITÉ LOCALE',
    channels: ['Google', 'ChatGPT', 'Moteurs IA'],
    growth: ['Plus de clients.', 'Plus de croissance.'],
    countryLabel: 'France',
  },

  hero: {
    eyebrow: 'VOTRE VISIBILITÉ, PARTOUT OÙ VOS CLIENTS CHERCHENT',
    h1Line1: 'Vos prochains clients',
    h1Line2: 'vous cherchent déjà.',
    sublead:
      'NFC Retail analyse votre visibilité digitale et vous aide à être trouvé, recommandé et choisi par plus de clients.',
    benefits: [
      { title: 'Visibilité locale', sub: 'sur Google Maps' },
      { title: 'Avis clients', sub: 'et réputation' },
      { title: 'Analyse IA', sub: 'et opportunités' },
      { title: 'Plus de clients', sub: 'et de chiffre d’affaires' },
    ],
    scribbles: {
      left: 'Vos clients\nvous cherchent\nici…',
      right: '… et aussi\nsur ChatGPT\net les moteurs IA !',
    },
  },

  form: {
    titleLead: 'Découvrez si vos clients peuvent vous trouver sur ',
    engineDefault: 'CHATGPT.',
    subtitle: 'Recevez votre diagnostic de visibilité en moins d’une minute.',
    fields: {
      establishmentLabel: 'Nom de votre établissement',
      establishmentPlaceholder: 'Ex : Maison Zayna',
      cityLabel: 'Ville',
      cityPlaceholder: 'Ex : Paris',
      firstNameLabel: 'Prénom',
      firstNamePlaceholder: 'Ex : Anass',
      lastNameLabel: 'Nom',
      lastNamePlaceholder: 'Ex : Karabila',
      emailLabel: 'Email professionnel',
      emailPlaceholder: 'Ex : anass@monentreprise.fr',
      phoneLabel: 'Téléphone',
      phonePlaceholder: 'Ex : 06 12 34 56 78',
    },
    submitLabel: 'ANALYSER MA VISIBILITÉ',
    microProof: ['Diagnostic personnalisé', 'Sans engagement', 'Moins d’une minute'],
    privacy: 'Vos informations restent confidentielles.',
    consent: {
      before: 'En envoyant ce formulaire, vous acceptez notre ',
      linkLabel: 'politique de confidentialité',
      after: '.',
    },
    errors: {
      required: 'Merci de compléter correctement tous les champs obligatoires.',
      email: 'Merci de renseigner une adresse e-mail valide.',
      phone: 'Merci de renseigner un numéro de téléphone valide.',
    },
    submitError:
      'Une erreur temporaire est survenue. Votre demande n’a pas pu être finalisée. Merci de réessayer dans quelques instants.',
  },

  trust: {
    establishments: 'Plus de 500 établissements nous font confiance',
    ratingScore: '4.8/5',
    ratingLabel: 'Satisfaction de nos clients',
    googlePartner: 'Google Partner',
    rgpd: 'Sécurisé & conforme RGPD',
    madeInFrance: 'Solution développée en France',
  },

  mobileCtaLabel: 'ANALYSER MA VISIBILITÉ →',

  privacy: {
    // Bump this whenever the privacy policy text shown on the landing changes.
    noticeVersion: '2026-09-01',
  },

  confirmation: {
    title: (firstName) =>
      firstName
        ? `Merci ${firstName}, votre demande a bien été reçue.`
        : 'Votre demande d’analyse a bien été reçue.',
    body: (establishmentName) =>
      establishmentName
        ? `Un membre de l’équipe NFC Retail va étudier la visibilité de ${establishmentName}.`
        : 'Merci ! Un membre de l’équipe NFC Retail va étudier la visibilité de votre établissement.',
    nextStepsTitle: 'La suite',
    nextSteps: [
      'Nous analysons votre présence sur Google, Maps et les moteurs IA.',
      'Nous vous contactons pour vous présenter votre diagnostic personnalisé.',
      'Nous vous proposons un plan d’action pour développer votre visibilité.',
    ],
    backHomeLabel: 'Retour à l’accueil',
  },

  footer: {
    logoAlt: 'NFC Retail',
    tagline: 'Visibilité, réputation et acquisition pour les commerces de terrain.',
    links: [
      { label: 'Mentions légales', href: PATHS.mentionsLegales },
      { label: 'Confidentialité', href: PATHS.politiqueConfidentialite },
      { label: 'Contact', href: `${SITE_URL}/contact`, external: true },
    ],
    manageCookiesLabel: 'Gérer les cookies',
    copyright: `© ${new Date().getFullYear()} NFC Retail — Tous droits réservés.`,
  },

  legalPlaceholder: {
    body: 'Ce contenu doit être rédigé et validé par l’équipe juridique de NFC Retail avant la mise en production.',
  },
};
