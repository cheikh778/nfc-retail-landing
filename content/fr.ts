import { SITE_URL } from '@/lib/seo';
import { PATHS } from '@/lib/paths';
import type { LandingContent } from './types';

/**
 * V1 France content for /fr/visibilite.
 * Texts marked "exact" in the brief are copied verbatim — do not rephrase
 * them without checking with marketing. Visual copy follows the submitted
 * design canvas (scratchpad/design/*.dc.html).
 */
export const fr: LandingContent = {
  locale: 'fr-FR',

  meta: {
    title: 'NFC Retail — Améliorez la visibilité de votre établissement',
    description:
      'Analysez gratuitement la visibilité de votre établissement sur Google, ChatGPT et les nouveaux moteurs IA avec NFC Retail. Audit gratuit, sans engagement.',
    canonicalUrl: `${SITE_URL}${PATHS.visibilite}`,
    robots: 'index, follow',
    ogImage: '/assets/landing/fr/og-image.png',
  },

  header: {
    logoSrc: '/assets/landing/fr/logo.png',
    logoAlt: 'NFC Retail',
  },

  hero: {
    chips: ['Google', 'ChatGPT', 'Nouveaux moteurs IA'],
    h1: 'Vos futurs clients vous trouvent-ils vraiment ?',
    h1Highlight: 'vraiment',
    subtitle:
      'Soyez visible là où vos clients vous cherchent : Google, ChatGPT et les nouveaux moteurs IA.',
    ctaPrimaryLabel: 'Analyser gratuitement ma visibilité',
    ctaSecondaryLabel: 'Voir un exemple de diagnostic',
    reassurance: ['Audit gratuit', 'Sans engagement', 'Analyse personnalisée'],
    preview: {
      browserBar: 'app.nfcretail.com/avis',
      dashboardSrc: '/assets/landing/fr/dashboard-avis.webp',
      dashboardAlt: 'Tableau de bord NFC Retail — suivi des avis Google',
      statVisibiliteLabel: 'Visibilité',
      statVisibiliteValue: '87 %',
      statAvisLabel: 'Avis clients',
      statAvisValue: '4,8 ★',
    },
  },

  modal: {
    closeLabel: 'Fermer',
    stepIndicator: (step) => `Étape ${step} sur 2`,
    step1: {
      establishmentLabel: "Nom de l'établissement",
      establishmentPlaceholder: 'Ex. Le Comptoir du Marché',
      cityLabel: 'Ville',
      cityPlaceholder: 'Ex. Lyon',
      activityLabel: 'Activité',
      activityPlaceholder: 'Ex. Restaurant, institut de beauté…',
      ctaLabel: 'Analyser ma visibilité',
    },
    step2: {
      backLabel: 'Retour',
      firstNameLabel: 'Prénom',
      firstNamePlaceholder: 'Ex. Camille',
      lastNameLabel: 'Nom',
      lastNamePlaceholder: 'Ex. Martin',
      phoneLabel: 'Téléphone',
      phonePlaceholder: 'Ex. 06 12 34 56 78',
      emailLabel: 'E-mail',
      emailPlaceholder: 'Ex. camille@monentreprise.fr',
      websiteLabel: 'Site internet',
      websitePlaceholder: 'Ex. www.monentreprise.fr',
      websiteOptionalHint: 'Optionnel',
      ctaLabel: 'Recevoir mon diagnostic gratuit',
    },
    consent: {
      before:
        'J’accepte que mes informations soient utilisées afin de traiter ma demande, conformément à la ',
      linkLabel: 'politique de confidentialité',
      after: '.',
      error: 'Merci de cocher cette case pour envoyer votre demande.',
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
