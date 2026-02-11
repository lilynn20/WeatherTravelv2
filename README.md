# 🌍 WeatherTravel - Application React de Planification Météo

Application React moderne permettant de planifier des voyages en fonction des conditions météorologiques. Utilise Redux Toolkit pour la gestion d'état et l'API OpenWeatherMap pour les données météo en temps réel.

## 📋 Fonctionnalités

### ✅ Fonctionnalités implémentées

- **Recherche de ville** : Formulaire de recherche avec validation complète
- **Météo actuelle** : Affichage détaillé des conditions météo (température, humidité, vent, pression)
- **Gestion des favoris** : Épinglage/suppression de villes avec persistance localStorage
- **Dashboard** : Vue d'ensemble des villes favorites avec statistiques
- **Détails ville** : Page dédiée avec prévisions sur 5 jours
- **Géolocalisation** : Recherche météo basée sur la position de l'utilisateur
- **Gestion d'erreurs** : Messages d'erreur clairs et gestion des cas limites
- **État de chargement** : Spinners et feedback visuel pendant les requêtes
- **Page 404** : Page d'erreur personnalisée
- **Navigation** : React Router avec 4 routes (Home, Dashboard, CityDetail, NotFound)

## 🛠 Technologies utilisées

- **React 18** : Bibliothèque UI avec hooks
- **Redux Toolkit** : Gestion d'état centralisée avec slices et async thunks
- **React Router v6** : Routing et navigation
- **Axios** : Requêtes HTTP vers l'API météo
- **Tailwind CSS** : Framework CSS utilitaire pour le styling
- **Vite** : Build tool moderne et rapide
- **OpenWeatherMap API** : Données météo en temps réel

## 📦 Installation

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet** (ou extraire l'archive)
```bash
cd weathertravel
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer la clé API**
   
   Obtenir une clé API gratuite sur [OpenWeatherMap](https://openweathermap.org/api)
   
   Éditer le fichier `src/utils/constants.js` et remplacer :
   ```javascript
   export const WEATHER_API_KEY = 'VOTRE_CLE_API_ICI';
   ```

4. **Lancer l'application en mode développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

5. **Build pour la production**
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
│   │   └── favorites/
│   │       └── favoritesSlice.js       # Redux slice favoris
│   ├── pages/
│   │   ├── Home.jsx                    # Page d'accueil (recherche)
│   │   ├── Dashboard.jsx               # Page des favoris
│   │   ├── CityDetail.jsx              # Page détails ville
│   │   └── NotFound.jsx                # Page 404
│   ├── components/
│   │   ├── SearchForm.jsx              # Formulaire de recherche
│   │   ├── WeatherCard.jsx             # Carte météo
│   │   ├── CityCard.jsx                # Carte ville favorite
│   │   ├── LoadingSpinner.jsx          # Composant de chargement
│   │   └── ErrorMessage.jsx            # Affichage d'erreurs
│   ├── utils/
│   │   └── constants.js                # Constantes et config API
│   ├── App.jsx                         # Composant racine + routing
│   ├── main.jsx                        # Point d'entrée
│   └── index.css                       # Styles globaux Tailwind
├── public/                             # Assets statiques
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
- Cliquer sur "Épingler cette ville" pour l'ajouter aux favoris

### 2. Dashboard (Mes destinations)
- Voir toutes les villes épinglées
- Consulter les statistiques (température moyenne, ville la plus chaude/froide)
- Supprimer des villes individuellement ou tout effacer
- Cliquer sur une ville pour voir les détails

### 3. Détails de ville
- Voir les informations météo complètes
- Consulter les prévisions sur 5 jours
- Épingler la ville si elle ne l'est pas déjà

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

## 📝 Validation du formulaire

Le formulaire de recherche implémente plusieurs validations :

1. **Champ vide** : Interdit la soumission sans texte
2. **Longueur minimale** : Au moins 2 caractères requis
3. **Trimming** : Suppression des espaces avant/après
4. **Feedback visuel** : Messages d'erreur en temps réel
5. **État désactivé** : Pendant le chargement

## 🎨 Design et UX

- **Design responsive** : S'adapte à tous les écrans (mobile, tablette, desktop)
- **Animations** : Transitions fluides et spinners de chargement
- **Icônes météo** : Emojis contextuels selon les conditions
- **Navigation intuitive** : Barre de navigation sticky avec badge de compteur
- **Messages clairs** : Erreurs et états vides bien expliqués
- **Tailwind CSS** : Styling moderne et cohérent

## 🔄 Gestion des états asynchrones

Chaque requête API passe par 3 états :
1. **Pending** : Affichage du loader
2. **Fulfilled** : Affichage des données
3. **Rejected** : Affichage de l'erreur avec possibilité de réessayer

## 💾 Persistance des données

Les villes favorites sont automatiquement sauvegardées dans le `localStorage` du navigateur, permettant de conserver les données entre les sessions.

## ⚠️ Gestion des erreurs

Types d'erreurs gérées :
- **CITY_NOT_FOUND** : Ville introuvable (404)
- **NETWORK_ERROR** : Problème de connexion
- **INVALID_API_KEY** : Clé API invalide (401)
- **EMPTY_FIELD** : Champ de recherche vide
- **GENERIC_ERROR** : Erreurs génériques

## 🚀 Améliorations possibles

- [ ] Ajout d'un mode sombre
- [ ] Graphiques pour les prévisions
- [ ] Comparaison de villes
- [ ] Notifications météo
- [ ] Export des favoris (JSON, CSV)
- [ ] Recherche par code postal ou coordonnées
- [ ] Traductions multilingues
- [ ] PWA (Progressive Web App)
- [ ] Tests unitaires et E2E

## 📄 Licence

Ce projet est créé dans un cadre pédagogique.

## 👨‍💻 Auteur

Projet WeatherTravel - Application React avec Redux Toolkit

---

**Note** : N'oubliez pas de configurer votre clé API OpenWeatherMap dans `src/utils/constants.js` avant de lancer l'application !
