# Yaaden — Covoiturage en Guinée

**Yaaden** est une application mobile de covoiturage (style BlaBlaCar) pour la Guinée.
Un service de **Digifind** — transformation digitale & IA.

🌐 En ligne : https://yaaden.vercel.app

## Fonctionnalités (v1)

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

## Technique

- 100 % statique : HTML / CSS / JS, aucune étape de build, aucun backend pour cette v1.
- Données de démo réalistes + `localStorage` (trajets publiés, réservations, profil).
- Déployé sur Vercel (équipe Digifind), chaque push sur `main` redéploie automatiquement.

## Et après ?

- Emballage **Capacitor** pour publier sur Android (Google Play), puis iOS (App Store).
- Backend (comptes, réservations partagées, notifications) quand les premiers utilisateurs seront là.
