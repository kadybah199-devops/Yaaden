# Yaaden — Covoiturage en Guinée

**Yaaden** est une application mobile de covoiturage (style BlaBlaCar) pour la Guinée.
Un service de **Digifind** — transformation digitale & IA.

🌐 En ligne : https://yaaden.vercel.app

## Fonctionnalités

- **Recherche** : départ, arrivée, date, nombre de passagers — deux modes :
  - **Entre villes** : 11 villes guinéennes (Conakry, Kindia, Mamou, Labé, Kankan, Nzérékoré, Boké, Faranah, Siguiri, Coyah, Dubréka).
  - **En ville à Conakry** : communes et quartiers (Kaloum, Dixinn, Ratoma, Matam, Matoto, Kipé, Taouyah, Lambanyi, Cosa, Hamdallaye, Bambéto, Kaporo, Enco 5, Sangoyah, Nongo, Sonfonia, Kagbélen…), petits prix 20 000 – 60 000 GNF.
- Prix en GNF partout.
- **Résultats** : cartes trajets avec conducteur noté, prix, places restantes, heure de départ, options (climatisation, bagages, musique).
- **Publier un trajet** : formulaire complet, le trajet apparaît dans la liste.
- **Détail + réservation** : nombre de places, total, confirmation, contact du conducteur via WhatsApp.
- **Mes trajets** : réservations et trajets publiés, avec annulation.
- **Profil conducteur** : nom, téléphone WhatsApp, véhicule.
- **Paiement** : espèces ou Orange Money, directement entre passager et conducteur.
- **PWA installable** : manifest + service worker, fonctionne hors connexion après la première visite.

## Nouveautés (v7 — backend partagé)

- **Trajets, réservations, alertes et vérifications partagés** : un trajet
  publié sur un téléphone est visible par tous les autres. Fonctions
  serverless Vercel (`api/`) + magasin Blob privé `yaaden-data` (un fichier
  JSON par trajet, réservation et demande de vérification), comme Seedee.
  - `GET/POST/DELETE /api/rides` — trajets actifs à venir, publication,
    annulation (conducteur) ou suppression (admin).
  - `GET/POST/DELETE /api/bookings` — réservations (places décrémentées puis
    rendues à l'annulation).
  - `GET/POST /api/trip-status` — signal d'arrivée (« j'arrive », « je suis
    arrivé ») visible par les passagers.
  - `GET/POST/DELETE /api/verifications` — demandes de vérification et
    décisions de l'équipe (code admin).
- **Publication réservée aux conducteurs vérifiés** : pas de publication sans
  identité vérifiée (pièce + selfie contrôlés sur WhatsApp sous 24 h).
  Les passagers cherchent et réservent librement.
- **Page admin privée** (`admin.html`, code à 6 chiffres, non référencée) :
  valider ou refuser les vérifications, supprimer un trajet.
- **Hors ligne** : sans connexion, l'appli continue avec la démo et les
  données locales ; un trajet publié hors ligne est partagé automatiquement
  dès que la connexion revient. Le service worker ne met jamais les API en
  cache (données toujours fraîches).
- **Trajets de démo étiquetés « Exemple »** pour les distinguer des vrais
  trajets. Actualisation automatique des données toutes les minutes.
- Limites connues (v1 du backend) : pas de comptes (identifiant par
  téléphone), pas de limitation de débit, réservations simultanées sur les
  dernières places non verrouillées (risque négligeable à ce volume).
  Piège Blob (corrigé) : `get()` lit par défaut une copie en cache du CDN —
  les lectures passent `useCache: false` et les écritures
  `cacheControlMaxAge: 0`, sinon une réécriture (vérification validée,
  trajet annulé) restait invisible.

## Nouveautés (v6 — tarifs bas, priorité ville, écran aéré)

- **Tarifs baissés** : en ville à Conakry, 10 000 – 25 000 GNF par place
  (référence : le taxi en commun coûte environ 15 000 GNF). Entre villes,
  baisse modérée aussi (Conakry → Kindia dès 120 000 GNF). La valeur ajoutée
  affichée n'est plus le prix mais l'attente : même prix que le taxi en
  commun, sans la longue attente au bord de la route.
- **Priorité aux trajets en ville** : l'application s'ouvre sur « En ville ·
  Conakry » (recherche et publication), le hero parle de l'attente
  (« Une voiture près de vous, sans longue attente »).
- **Écran aéré** : bandeau défilant, section « Comment ça marche ? » et
  bandeau d'infos retirés de l'accueil ; « Pourquoi Yaaden ? » devient une
  simple ligne de 3 points sans carte ni titre ; 2 chiffres clés au lieu de 3.

## Nouveautés (v5 — proximité, arrivée, confiance)

- **« Voitures près de moi »** : le bouton de l'accueil demande la position du
  téléphone (géolocalisation du navigateur) et montre les départs proches
  (10 km en ville, 50 km entre villes), triés par distance, avec un badge
  « Départ à 1,2 km » sur chaque carte et un bandeau « X voitures près de
  vous ». La position n'est jamais enregistrée. Coordonnées approximatives des
  villes et quartiers dans `PLACE_COORDS` (app.js).
- **Alerte d'arrivée** : sur un trajet publié, le conducteur touche « J'arrive »
  puis « Je suis arrivé » ; le passager le voit dans « Mes trajets » et sur la
  fiche du trajet, et le conducteur peut prévenir ses passagers sur WhatsApp
  (message pré-rempli). Dans cette version sans serveur, le signal est stocké
  sur le téléphone (localStorage) : le suivi en temps réel entre deux
  téléphones demandera un serveur plus tard.
- **Vérification conducteurs** : badge « Vérifié » (pièce d'identité + permis
  contrôlés) sur les cartes et la fiche, filtre « Conducteurs vérifiés » dans
  la recherche, plaque d'immatriculation affichée. Dans le profil, le
  conducteur envoie sa plaque, la photo de sa pièce d'identité et un selfie
  (réduits et gardés sur le téléphone) puis les transmet à l'équipe Yaaden sur
  WhatsApp pour contrôle sous 24 h — pas de vérification automatique sans
  serveur.

## Nouveautés (v4 — « Nuit Conakry »)

- **Thème sombre choisi par Shahid** (après le retour « trop d'écriture, je n'aime
  pas les couleurs » sur la v3) : fond bleu nuit profond (#0B1F33), cartes
  bleu nuit relevé, texte blanc, une seule touche menthe (#3DDC97). Les couleurs
  chaudes (crème, orange, jaune soleil) sont parties ; les autocollants blancs
  ressortent sur le fond nuit. La photo de Conakry reste dans le hero, sous un
  voile nuit plus appuyé.
- **Texte allégé partout** : titre réduit à « Trouvez votre place. », paragraphes
  d'explication supprimés (étapes, « Pourquoi Yaaden ? », bandeaux), message
  d'accueil de Yaa raccourci.

## Nouveautés (v3 — « Ticket tropical »)

- **Identité visuelle qui sort du lot** : fond crème chaud, polices arrondies
  (Fredoka + Nunito), cartes façon autocollant (bordure encre + ombre franche),
  cartes trajets en **ticket perforé** avec encoches latérales, badges autocollants
  inclinés, navigation basse en pilule flottante avec bouton Publier surélevé.
- **Vraie photo de Conakry** dans le hero (rond-point avec taxis jaunes, Financial
  Afrik) sous un voile bleu Digifind — avec dégradé de secours si la photo ne charge
  pas. La photo est à remplacer par une photo maison pour la version finale.
- **Bandeau défilant** des prix des trajets populaires, et carrousel de cartes
  dégradées pour les trajets populaires.

## Nouveautés (v2)

- **Design refondu** : hero qui parle du vrai problème (attente aux heures de pointe),
  bandeau « Heures de pointe », chiffres clés, section « Comment ça marche ? » en 3 étapes,
  encadré « Pourquoi Yaaden ? », appel aux conducteurs, visuel d'itinéraire sur chaque carte trajet.
- **Yaa, l'assistante Yaaden** : avatar flottant d'aide en bas à droite, réponses
  instantanées aux questions fréquentes (réservation, paiement, publication, trajets en
  ville…) et bouton « Parler à une personne sur WhatsApp » (+224 620 68 56 45).
- **Paiement** : espèces ou Orange Money, directement entre passager et conducteur.

## Technique

- 100 % statique pour l'interface (HTML / CSS / JS, aucune étape de build) +
  fonctions serverless Vercel (`api/`, Node + `@vercel/blob`) et magasin Blob
  privé `yaaden-data` pour les données partagées ; `package.json` à la racine
  déclare la dépendance.
- Données de démo réalistes + `localStorage` (trajets publiés, réservations, profil, historique du chat Yaa) ; identifiant stable par téléphone (`yaaden_device_id_v1`) sans compte.
- Déployé sur Vercel (équipe Digifind) par envoi direct des fichiers ; le projet Vercel
  n'est pas encore relié au dépôt GitHub, donc un push ne redéploie pas tout seul — le
  déploiement se relance à la main après chaque push.

## Et après ?

- Emballage **Capacitor** pour publier sur Android (Google Play), puis iOS (App Store).
  La PWA est déjà installable : le lien https://yaaden.vercel.app partagé dans WhatsApp
  suffit pour les premiers essais à Conakry, sans passer par les stores.
- Backend (comptes, réservations partagées, notifications) quand les premiers utilisateurs seront là.
