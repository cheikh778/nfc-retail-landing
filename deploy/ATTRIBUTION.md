# Attribution des leads et liens de campagne

Les sources ne sont pas limitées à une liste de plateformes : toute valeur
`utm_source` non vide est conservée, avec les cinq UTM et les identifiants de
clic reçus. Les valeurs sont décodées par `URLSearchParams` et limitées à
500 caractères ; la casse des identifiants de clic est conservée.

## Du navigateur au CRM

1. `AttributionCapture` capture l'arrivée sur chaque page Next et les
   changements de paramètres, même si Analytics a été refusé.
2. `lib/utm.ts` conserve la dernière acquisition dans la session. Les pages
   internes et retours directs conservent cette attribution ; une nouvelle
   campagne ou une nouvelle arrivée externe la remplace entièrement.
3. `lib/api.ts` recapture avant le POST, puis conserve le même payload lors
   d'une reprise CSRF. Si le stockage est bloqué, la mémoire préserve les
   paramètres pendant les navigations dans le document courant.
4. L'API Node `nfcretail-api` valide les entrées et normalise l'attribution
   avant la première tentative CRM et la sauvegarde locale. Les nouvelles
   copies en attente contiennent donc déjà cette attribution. Le rejeu
   conserve le payload initial pour respecter la clé d'idempotence du CRM ;
   il ne modifie pas rétroactivement les anciennes attributions.

Les helpers `lib/attribution.ts` et `nfcretail-api/src/lib/attribution.ts`
suivent la même politique, vérifiée par les mêmes tests dans les deux repos.

| Signal disponible | Source de secours | Support de secours |
| --- | --- | --- |
| UTM explicites | Valeur `utm_source` conservée | Valeur `utm_medium` conservée |
| `gclid`, `gbraid` ou `wbraid` | `google` | `cpc` |
| `msclkid` | `bing` | `cpc` |
| `fbclid` | `facebook` | `social` (le clic seul ne prouve pas une publicité) |
| Référent Google/Bing | `google` / `bing` | `organic` |
| Autre référent externe | Nom de domaine, par exemple `chatgpt.com` | `referral` |
| Campagne partielle sans source identifiable | `unknown` | `(unknown)` |
| Aucun signal transmis | `direct` | `(none)` |

Les UTM explicites ont priorité sur les valeurs inférées. Un support absent
et non déductible est `(unknown)`. La campagne, le contenu et le terme restent
absents s'ils ne sont pas transmis : un identifiant de clic seul ne permet pas
de récupérer le nom de campagne. `direct` désigne une origine non transmise,
pas une preuve que le visiteur a saisi l'adresse.

L'API conserve tous les identifiants capturés dans sa copie locale. Le contrat
CRM actuel transmet les cinq UTM, l'URL d'entrée, le référent et les trois
identifiants Google. Les champs supplémentaires d'autres régies nécessitent
une extension du contrat CRM ; leur source UTM est déjà transmise.

## Liens à utiliser pour les campagnes

Google Ads, exemple d'URL finale :

```text
https://nfcretail.com/fr/visibilite/?utm_source=google&utm_medium=cpc&utm_campaign=visibilite_fr&utm_content=annonce_01
```

ChatGPT, exemple pour une campagne payante :

```text
https://nfcretail.com/fr/visibilite/?utm_source=chatgpt&utm_medium=ads&utm_campaign=visibilite_fr&utm_content=annonce_01
```

Autre partenaire : remplacer `utm_source`, `utm_medium` et `utm_campaign` par
les valeurs choisies. Toujours renseigner ces trois paramètres dans les liens
publicitaires et donner un nom distinct aux campagnes. Les valeurs contenant
des espaces ou accents doivent être encodées dans l'URL.

Le marquage automatique Google ajoute un identifiant de clic ; il complète
les UTM, sans remplacer leur configuration pour connaître la campagne dans
ce CRM. Voir [le marquage automatique Google](https://support.google.com/google-ads/answer/3095550?hl=fr).
Une source reçue sous la forme `utm_source=chatgpt.com` reste également intacte.

Le Worker Cloudflare conserve `url.search` dans le routage vers Pages et dans
la redirection `www` vers le domaine principal. Toute redirection ajoutée dans
une campagne doit également conserver les paramètres. Sans UTM, identifiant
ou référent, l'origine exacte ne peut pas être reconstruite. Avec le stockage
bloqué et un rechargement complet sans paramètres, la mémoire précédente est
perdue ; la nouvelle visite utilise alors les signaux encore disponibles.

## Validation

- Front : `npm test`, `npm run build`, `npm run test:e2e -- --workers=1`.
- API : `npm test`, `npm run build` (ou `node node_modules/typescript/bin/tsc -p tsconfig.json` sur Windows).
- L'intégration API utilise un CRM simulé et un fichier temporaire pour vérifier
  à la fois le JSON réellement envoyé et l'attribution sauvegardée.
- Les tests navigateur interceptent les envois de leads et n'alimentent pas
  le CRM de production.
