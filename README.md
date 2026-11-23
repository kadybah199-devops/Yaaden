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

- 100 % statique : HTML / CSS / JS, aucune étape de build, aucun backend pour cette v2.
- Données de démo réalistes + `localStorage` (trajets publiés, réservations, profil, historique du chat Yaa).
- Déployé sur Vercel (équipe Digifind) par envoi direct des fichiers ; le projet Vercel
  n'est pas encore relié au dépôt GitHub, donc un push ne redéploie pas tout seul — le
  déploiement se relance à la main après chaque push.

## Et après ?

- Emballage **Capacitor** pour publier sur Android (Google Play), puis iOS (App Store).
  La PWA est déjà installable : le lien https://yaaden.vercel.app partagé dans WhatsApp
  suffit pour les premiers essais à Conakry, sans passer par les stores.
- Backend (comptes, réservations partagées, notifications) quand les premiers utilisateurs seront là.
