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
    subtitle: 'Recevez votre diagnostic de visibilité rapidement.',
    fields: {
      establishmentLabel: 'Nom de votre établissement sur Google (fiche Google My Business)',
      establishmentPlaceholder: 'Ex : Maison Zayna',
      cityLabel: 'Ville',
      cityPlaceholder: 'Ex : Paris',
      firstNameLabel: 'Prénom',
      firstNamePlaceholder: 'Ex : Jean',
      lastNameLabel: 'Nom',
      lastNamePlaceholder: 'Ex : Dupont',
      emailLabel: 'Email professionnel',
      emailPlaceholder: 'Ex : jean@monentreprise.fr',
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

  legal: {
    mentionsLegales: {
      lastUpdated: 'juillet 2026',
      sections: [
        {
          heading: 'Éditeur du site',
          paragraphs: [
            'Le site nfcretail.com est édité par :',
            'NFC Retail',
            'Siège social : Boulevard My Hassan 1, immeuble Sibam, block A, 3ème étage n°10, Marrakech, Maroc',
            'E-mail : contact@nfcretail.com',
          ],
        },
        {
          heading: 'Hébergement',
          paragraphs: [
            'Le site est hébergé par :',
            'Hostinger International Ltd.',
            '61 Lordou Vironos Street, 6023 Larnaca, Chypre',
            'Site web : www.hostinger.fr',
          ],
        },
        {
          heading: 'Propriété intellectuelle',
          paragraphs: [
            'L’ensemble des éléments composant le site nfcretail.com (textes, images, logos, graphismes, vidéos, icônes, structure, mise en page) est la propriété exclusive de NFC Retail, sauf mention contraire. Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, de ces éléments, quel que soit le moyen ou le procédé utilisé, est interdite sans l’autorisation écrite préalable de NFC Retail. Toute exploitation non autorisée du site ou de son contenu sera considérée comme constitutive d’une contrefaçon et pourra faire l’objet de poursuites.',
          ],
        },
        {
          heading: 'Protection des données personnelles',
          paragraphs: [
            'Les informations recueillies via les formulaires du site (nom, e-mail, téléphone, message) sont destinées uniquement à NFC Retail pour répondre à vos demandes et vous recontacter. Elles ne sont ni vendues ni cédées à des tiers.',
            'Conformément à la loi marocaine n° 09-08 relative à la protection des personnes physiques à l’égard du traitement des données à caractère personnel, ainsi qu’au Règlement Général sur la Protection des Données (RGPD) pour les visiteurs européens, vous disposez d’un droit d’accès, de rectification, d’opposition et de suppression des données vous concernant. Pour exercer ce droit, contactez-nous à l’adresse : contact@nfcretail.com.',
          ],
        },
        {
          heading: 'Cookies',
          paragraphs: [
            'Le site nfcretail.com peut utiliser des cookies afin d’améliorer l’expérience de navigation, de mesurer l’audience et d’assurer le bon fonctionnement de ses services. Vous pouvez à tout moment configurer votre navigateur pour refuser les cookies ou être averti de leur dépôt.',
          ],
        },
        {
          heading: 'Responsabilité',
          paragraphs: [
            'NFC Retail s’efforce d’assurer l’exactitude et la mise à jour des informations diffusées sur le site, mais ne saurait garantir l’absence totale d’erreurs ou d’omissions. NFC Retail ne pourra être tenue responsable des dommages directs ou indirects résultant de l’accès ou de l’utilisation du site, y compris l’inaccessibilité, les pertes de données ou la présence de virus. Les liens externes présents sur le site n’engagent pas la responsabilité de NFC Retail quant à leur contenu.',
          ],
        },
        {
          heading: 'Droit applicable',
          paragraphs: [
            'Les présentes mentions légales sont régies par le droit marocain. En cas de litige, et à défaut de résolution amiable, compétence est attribuée aux tribunaux compétents de Marrakech.',
          ],
        },
      ],
    },

    politiqueConfidentialite: {
      lastUpdated: '1 septembre 2026',
      sections: [
        {
          heading: 'Responsable du traitement',
          paragraphs: [
            'Le responsable du traitement des données collectées sur cette page est NFC Retail, dont le siège social est situé Boulevard My Hassan 1, immeuble Sibam, block A, 3ème étage n°10, Marrakech, Maroc. Pour toute question relative à vos données personnelles, contactez-nous à l’adresse : contact@nfcretail.com.',
          ],
        },
        {
          heading: 'Données collectées',
          paragraphs: [
            'Lorsque vous complétez le formulaire de diagnostic de visibilité, nous collectons :',
          ],
          list: [
            'le nom de votre établissement et sa ville',
            'votre prénom, nom, e-mail professionnel et téléphone',
            'des données techniques d’attribution (page d’origine, référent, paramètres UTM, identifiants publicitaires le cas échéant), utilisées pour comprendre comment vous nous avez trouvés',
            'la date et la version de la notice de consentement acceptée au moment de l’envoi',
          ],
        },
        {
          heading: 'Finalités et base légale',
          paragraphs: [
            'Ces données sont utilisées pour établir votre diagnostic de visibilité, vous recontacter à ce sujet et, sauf opposition de votre part, vous informer de nos offres. Le traitement repose sur votre consentement, donné en soumettant le formulaire, et sur l’intérêt légitime de NFC Retail à répondre aux demandes qui lui sont adressées.',
          ],
        },
        {
          heading: 'Destinataires des données',
          paragraphs: [
            'Vos données sont transmises à l’équipe commerciale de NFC Retail via un outil de gestion de la relation client (CRM) hébergé de façon sécurisée. Elles ne sont ni vendues ni cédées à des tiers à des fins commerciales.',
          ],
        },
        {
          heading: 'Durée de conservation',
          paragraphs: [
            'Vos données sont conservées le temps nécessaire au traitement de votre demande et à la relation commerciale qui peut en découler, puis archivées ou supprimées conformément aux durées légales applicables.',
          ],
        },
        {
          heading: 'Cookies',
          paragraphs: [
            'Un cookie technique, strictement nécessaire à la sécurité du formulaire (protection contre les soumissions frauduleuses), est déposé lors de l’envoi de votre demande. Des cookies de mesure d’audience ne sont déposés qu’après votre consentement, recueilli via le bandeau affiché lors de votre première visite ; vous pouvez modifier votre choix à tout moment via « Gérer les cookies » en pied de page.',
          ],
        },
        {
          heading: 'Vos droits',
          paragraphs: [
            'Conformément à la loi marocaine n° 09-08 et, pour les personnes situées dans l’Union européenne, au Règlement Général sur la Protection des Données (RGPD), vous disposez d’un droit d’accès, de rectification, d’opposition, de limitation et de suppression des données vous concernant. Pour exercer ces droits, contactez-nous à l’adresse : contact@nfcretail.com.',
          ],
        },
        {
          heading: 'Sécurité',
          paragraphs: [
            'NFC Retail met en œuvre les mesures techniques et organisationnelles raisonnables pour protéger vos données contre l’accès non autorisé, la perte ou l’altération.',
          ],
        },
      ],
    },
  },
};
