# 🌍 WeatherTravel - Application React de Planification Météo

Application React moderne permettant de planifier des voyages en fonction des conditions météorologiques avec **rappels par email**. Utilise Redux Toolkit pour la gestion d'état et l'API OpenWeatherMap pour les données météo en temps réel.

## ✨ Nouvelles fonctionnalités (v2.0)

### 🎯 Planification de voyage avec rappels email
- **Sélection de date** : Choisissez votre date de voyage avec un calendrier intuitif
- **Rappels automatiques** : Recevez un email avec la météo et des conseils de voyage
- **Gestion complète** : Visualisez et gérez tous vos voyages planifiés
- **Email personnalisé** : Template professionnel avec météo, conseils et liste de bagages

## 📋 Fonctionnalités

### ✅ Fonctionnalités principales

#### Météo et Recherche
- **Recherche de ville** : Formulaire de recherche avec validation complète
- **Météo actuelle** : Affichage détaillé des conditions météo (température, humidité, vent, pression)
- **Géolocalisation** : Recherche météo basée sur la position de l'utilisateur

#### Gestion des favoris
- **Épinglage** : Sauvegarde de villes favorites
- **Persistance** : Données conservées dans localStorage
- **Statistiques** : Vue d'ensemble avec température moyenne, ville la plus chaude/froide

#### 🆕 Planification de voyage
- **Sélection de date** : Interface calendrier pour choisir votre date de départ
- **Email de rappel** : Recevez automatiquement un email avant votre voyage
- **Dashboard avancé** : Onglets séparés pour favoris et voyages planifiés
- **Compte à rebours** : Visualisez le temps restant avant chaque voyage
- **Gestion flexible** : Renvoyer ou supprimer des rappels facilement

#### Autres fonctionnalités
- **Détails ville** : Page dédiée avec prévisions sur 5 jours
- **Gestion d'erreurs** : Messages d'erreur clairs et gestion des cas limites
- **État de chargement** : Spinners et feedback visuel pendant les requêtes
- **Page 404** : Page d'erreur personnalisée
- **Navigation** : React Router avec 4 routes

## 🛠 Technologies utilisées

- **React 18** : Bibliothèque UI avec hooks
- **Redux Toolkit** : Gestion d'état centralisée avec slices et async thunks
- **React Router v6** : Routing et navigation
- **Axios** : Requêtes HTTP vers l'API météo
- **Tailwind CSS** : Framework CSS utilitaire pour le styling
- **Vite** : Build tool moderne et rapide
- **EmailJS** : Service d'envoi d'emails (gratuit)
- **OpenWeatherMap API** : Données météo en temps réel

## 📦 Installation

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn
- Compte OpenWeatherMap (gratuit)
- Compte EmailJS (gratuit) - **NOUVEAU**

### Étapes d'installation

1. **Cloner le projet**
```bash
cd weathertravel
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer la clé API OpenWeatherMap**
   
   Obtenir une clé API gratuite sur [OpenWeatherMap](https://openweathermap.org/api)
   
   Éditer le fichier `src/utils/constants.js` et remplacer :
   ```javascript
   export const WEATHER_API_KEY = 'VOTRE_CLE_API_ICI';
   ```

4. **🆕 Configurer EmailJS (pour les rappels)**
   
   Suivez le guide complet dans **[EMAIL_SETUP.md](./EMAIL_SETUP.md)**
   
   Résumé rapide :
   - Créer un compte sur [EmailJS](https://www.emailjs.com/)
   - Configurer un service email (Gmail recommandé)
   - Créer un template d'email
   - Copier vos clés dans `src/features/travelPlans/emailService.js`

5. **Lancer l'application en mode développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

6. **Build pour la production**
```bash
npm run build
npm run preview
```

## 🏗 Architecture du projet

```
weathertravel/
├── src/
│   ├── app/
│   │   └── store.js                    # Configuration Redux Store
│   ├── features/
│   │   ├── weather/
│   │   │   ├── weatherSlice.js         # Redux slice météo
│   │   │   └── weatherService.js       # Service API météo
│   │   ├── favorites/
│   │   │   └── favoritesSlice.js       # Redux slice favoris
│   │   └── travelPlans/                # 🆕 Nouveau
│   │       ├── travelPlansSlice.js     # Redux slice plans de voyage
│   │       └── emailService.js         # Service EmailJS
│   ├── pages/
│   │   ├── Home.jsx                    # Page d'accueil (recherche)
│   │   ├── Dashboard.jsx               # 🆕 Mis à jour avec onglets
│   │   ├── CityDetail.jsx              # Page détails ville
│   │   └── NotFound.jsx                # Page 404
│   ├── components/
│   │   ├── SearchForm.jsx              # Formulaire de recherche
│   │   ├── WeatherCard.jsx             # 🆕 Avec bouton planification
│   │   ├── CityCard.jsx                # Carte ville favorite
│   │   ├── TravelDateModal.jsx         # 🆕 Modal de planification
│   │   ├── TravelPlanCard.jsx          # 🆕 Carte plan de voyage
│   │   ├── LoadingSpinner.jsx          # Composant de chargement
│   │   └── ErrorMessage.jsx            # Affichage d'erreurs
│   ├── utils/
│   │   └── constants.js                # Constantes et config API
│   ├── App.jsx                         # Composant racine + routing
│   ├── main.jsx                        # Point d'entrée
│   └── index.css                       # Styles globaux Tailwind
├── public/                             # Assets statiques
├── EMAIL_SETUP.md                      # 🆕 Guide configuration email
├── index.html                          # Template HTML
├── package.json                        # Dépendances
├── vite.config.js                      # Configuration Vite
├── tailwind.config.js                  # Configuration Tailwind
└── README.md                           # Ce fichier
```

## 🎯 Utilisation

### 1. Page d'accueil (Recherche)
- Entrer le nom d'une ville dans le formulaire
- Ou utiliser le bouton "Utiliser ma position" pour la géolocalisation
- Voir la météo actuelle affichée
- 🆕 **Cliquer sur "✈️ Planifier un voyage"** pour ajouter une date et recevoir un rappel
- Cliquer sur "Épingler cette ville" pour l'ajouter aux favoris

### 2. 🆕 Planification de voyage
- Sélectionner une date de voyage (calendrier)
- Entrer votre email pour recevoir un rappel
- Recevoir automatiquement un email avec :
  - Informations météo prévues
  - Conseils personnalisés selon la météo
  - Liste de bagages suggérée
  - Compte à rebours

### 3. Dashboard (Mes destinations)

#### Onglet Favoris
- Voir toutes les villes épinglées
- Consulter les statistiques (température moyenne, ville la plus chaude/froide)
- Supprimer des villes individuellement ou tout effacer
- Cliquer sur une ville pour voir les détails

#### 🆕 Onglet Voyages planifiés
- **Voyages à venir** : Liste chronologique avec compte à rebours
- **Voyages passés** : Historique de vos voyages
- **Statut des emails** : Voir si les rappels ont été envoyés
- **Actions** : Renvoyer un email ou supprimer un plan

### 4. Détails de ville
- Voir les informations météo complètes
- Consulter les prévisions sur 5 jours
- Épingler la ville si elle ne l'est pas déjà
- 🆕 Planifier un voyage depuis cette page

## 🔧 Gestion d'état Redux

### Slices Redux

#### **weatherSlice**
État :
- `currentWeather` : Météo actuelle de la ville recherchée
- `forecast` : Prévisions sur 5 jours
- `loading` : État de chargement
- `error` : Messages d'erreur
- `searchedCity` : Nom de la dernière ville recherchée

Actions asynchrones (thunks) :
- `fetchCurrentWeather(cityName)` : Récupère la météo actuelle
- `fetchForecast(cityName)` : Récupère les prévisions
- `fetchWeatherByCoords({lat, lon})` : Météo par géolocalisation

#### **favoritesSlice**
État :
- `cities` : Array des villes favorites (persisté dans localStorage)

Actions :
- `addCity(cityData)` : Ajoute une ville aux favoris
- `removeCity(cityId)` : Supprime une ville
- `updateCityWeather(weatherData)` : Met à jour la météo d'une ville
- `clearAllFavorites()` : Efface tous les favoris

#### 🆕 **travelPlansSlice**
État :
- `plans` : Array des plans de voyage (persisté dans localStorage)
- `loading` : État de chargement
- `error` : Messages d'erreur
- `emailSending` : État d'envoi d'email
- `emailSent` : Confirmation d'envoi

Actions :
- `addTravelPlan(planData)` : Ajoute un plan de voyage
- `removeTravelPlan(planId)` : Supprime un plan
- `markReminderSent(planId)` : Marque le rappel comme envoyé
- `clearAllPlans()` : Efface tous les plans
- `resetEmailStatus()` : Réinitialise le statut d'email

Actions asynchrones :
- `scheduleEmailReminder(params)` : Envoie un email de rappel via EmailJS

## 📧 Service Email (EmailJS)

### Configuration requise
1. Compte EmailJS gratuit (100 emails/mois)
2. Service email configuré (Gmail, Outlook, etc.)
3. Template d'email créé
4. Clés API dans `emailService.js`

### Fonctionnement
```javascript
// 1. User remplit le formulaire
{ date: '2024-03-15', email: 'user@example.com' }

// 2. Dispatch action
dispatch(scheduleEmailReminder({ ... }))

// 3. EmailJS envoie l'email
emailService.sendTravelReminder({ ... })

// 4. Email reçu avec météo et conseils
✉️ Template professionnel personnalisé
```

Voir **[EMAIL_SETUP.md](./EMAIL_SETUP.md)** pour le guide complet.

## 📝 Validation du formulaire

Le formulaire de planification implémente :

1. **Date valide** : Doit être dans le futur (max 1 an)
2. **Email valide** : Format vérifié par regex
3. **Champs requis** : Validation avant soumission
4. **Feedback visuel** : Messages d'erreur en temps réel
5. **État désactivé** : Pendant l'envoi de l'email

## 🎨 Design et UX

- **Design responsive** : S'adapte à tous les écrans (mobile, tablette, desktop)
- **Animations** : Transitions fluides et spinners de chargement
- **Icônes météo** : Emojis contextuels selon les conditions
- **Navigation intuitive** : Barre de navigation sticky avec badge de compteur
- **Messages clairs** : Erreurs et états vides bien expliqués
- **Tailwind CSS** : Styling moderne et cohérent
- 🆕 **Modal moderne** : Interface de planification élégante
- 🆕 **Onglets dashboard** : Organisation claire des contenus
- 🆕 **Badges de statut** : Compte à rebours visuel pour chaque voyage

## 📄 Gestion des états asynchrones

Chaque requête API passe par 3 états :
1. **Pending** : Affichage du loader
2. **Fulfilled** : Affichage des données
3. **Rejected** : Affichage de l'erreur avec possibilité de réessayer

🆕 Les emails suivent le même pattern avec feedback utilisateur.

## 💾 Persistance des données

- **Villes favorites** : `localStorage` → `weathertravel_favorites`
- 🆕 **Plans de voyage** : `localStorage` → `weathertravel_plans`
- Sauvegarde automatique à chaque modification
- Chargement au démarrage de l'application

## ⚠️ Gestion des erreurs

Types d'erreurs gérées :
- **CITY_NOT_FOUND** : Ville introuvable (404)
- **NETWORK_ERROR** : Problème de connexion
- **INVALID_API_KEY** : Clé API invalide (401)
- **EMPTY_FIELD** : Champ de recherche vide
- 🆕 **EMAIL_ERROR** : Erreur d'envoi d'email
- 🆕 **INVALID_DATE** : Date invalide ou passée
- **GENERIC_ERROR** : Erreurs génériques

## 🚀 Améliorations possibles

### Court terme
- [ ] Mode sombre
- [ ] Graphiques pour les prévisions (Chart.js)
- [ ] Comparaison de villes
- [ ] Export des favoris (JSON, CSV)

### Moyen terme
- [ ] 🆕 Scheduler automatique (emails X jours avant)
- [ ] 🆕 Notifications push (PWA)
- [ ] 🆕 Export iCal/Google Calendar
- [ ] 🆕 Rappels multiples configurables
- [ ] Recherche par code postal
- [ ] Traductions multilingues

### Long terme
- [ ] Tests unitaires et E2E
- [ ] TypeScript
- [ ] PWA (Progressive Web App)
- [ ] Backend avec authentification
- [ ] 🆕 Intégration SMS (Twilio)
- [ ] 🆕 Prévisions météo dans les emails
- [ ] 🆕 Templates d'email personnalisables

## 📊 Métriques du projet

**Statistiques v2.0** :
- **~3500 lignes** de code (+1000)
- **12 composants** React (+3)
- **4 pages** + 404
- **3 slices** Redux (+1)
- **5 thunks** asynchrones (+2)
- **100% fonctionnel**

**Technologies** :
- React 18
- Redux Toolkit 2.0
- React Router v6
- Tailwind CSS 3.4
- Vite 5
- 🆕 EmailJS 3.11

## 📚 Documentation

- **[EMAIL_SETUP.md](./EMAIL_SETUP.md)** : Guide complet configuration email
- **[DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md)** : Installation rapide
- **[RAPPORT.md](./RAPPORT.md)** : Rapport technique détaillé
- **[SOUTENANCE.md](./SOUTENANCE.md)** : Support de présentation

## 🐛 Dépannage

### Email non reçu
➡️ Vérifiez vos spams
➡️ Vérifiez la configuration EmailJS
➡️ Consultez la console navigateur pour les erreurs

### Erreur "EmailJS non configuré"
➡️ Suivez le guide [EMAIL_SETUP.md](./EMAIL_SETUP.md)
➡️ Vérifiez les 3 clés dans `emailService.js`

### Problèmes généraux
➡️ Voir [DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md)

## 📄 Licence

Ce projet est créé dans un cadre pédagogique.

## 👨‍💻 Auteur

Projet WeatherTravel v2.0 - Application React avec Redux Toolkit et EmailJS

---

**Note** : 
- N'oubliez pas de configurer votre clé API OpenWeatherMap dans `src/utils/constants.js`
- 🆕 Pour activer les rappels email, suivez le guide [EMAIL_SETUP.md](./EMAIL_SETUP.md)

**Bon voyage ! ✈️🌍**
