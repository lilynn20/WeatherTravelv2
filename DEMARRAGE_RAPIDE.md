# 🚀 GUIDE DE DÉMARRAGE RAPIDE - WeatherTravel

## ⚡ Installation en 3 étapes

### 1️⃣ Installer les dépendances

```bash
cd weathertravel
npm install
```

### 2️⃣ Configurer la clé API

1. Créer un compte gratuit sur [OpenWeatherMap](https://openweathermap.org/api)
2. Obtenir votre clé API
3. Ouvrir `src/utils/constants.js`
4. Remplacer :
   ```javascript
   export const WEATHER_API_KEY = 'VOTRE_CLE_API_ICI';
   ```

### 3️⃣ Lancer l'application

```bash
npm run dev
```

Ouvrir : `http://localhost:5173`

---

## 📋 Checklist de vérification

Avant de présenter le projet, vérifier que :

- [ ] Les dépendances sont installées (`node_modules/` existe)
- [ ] La clé API est configurée dans `constants.js`
- [ ] L'application se lance sans erreur (`npm run dev`)
- [ ] La recherche de ville fonctionne
- [ ] L'ajout aux favoris fonctionne
- [ ] La navigation entre les pages fonctionne
- [ ] Les erreurs s'affichent correctement
- [ ] Le responsive design fonctionne (tester sur mobile)

---

## 🎯 Points clés pour la soutenance

### Architecture Redux (à expliquer)

```
Store
├── weather slice
│   ├── currentWeather
│   ├── forecast
│   ├── loading
│   └── error
└── favorites slice
    └── cities []
```

### Flux de données

1. User action → Dispatch thunk
2. Thunk → API call
3. API response → Reducer update
4. State change → Component re-render

### Code à montrer

1. **weatherSlice.js** - Ligne 19-30 (createAsyncThunk)
2. **favoritesSlice.js** - Ligne 42-65 (actions avec localStorage)
3. **SearchForm.jsx** - Ligne 26-42 (validation)
4. **Home.jsx** - Ligne 30-35 (useSelector/useDispatch)

---

## 🐛 Dépannage rapide

### Erreur : "Invalid API key"
➡️ Vérifier que la clé est bien configurée dans `src/utils/constants.js`

### Erreur : "npm not found"
➡️ Installer Node.js depuis [nodejs.org](https://nodejs.org)

### Port 5173 déjà utilisé
➡️ Modifier le port dans `vite.config.js` ou arrêter l'autre application

### Les favoris ne se sauvent pas
➡️ Vérifier que le localStorage n'est pas désactivé dans le navigateur

---

## 📱 Test de démonstration

Scénario de démo suggéré :

1. **Recherche** : "Paris" → Météo affichée
2. **Épingler** : Ajouter Paris aux favoris
3. **Dashboard** : Naviguer vers "Mes destinations"
4. **Statistiques** : Montrer les stats (température moyenne)
5. **Détails** : Cliquer sur Paris → Prévisions 5 jours
6. **Géolocalisation** : Tester "Utiliser ma position"
7. **Erreur** : Chercher "xyzabc" → Message d'erreur
8. **404** : Aller sur `/route-inexistante`

---

## 📊 Critères d'évaluation attendus

✅ **Fonctionnel (40%)**
- Routes fonctionnelles
- Redux opérationnel
- API intégrée
- Formulaire validé

✅ **Technique (30%)**
- Code propre et structuré
- Gestion d'erreurs
- États asynchrones
- Bonnes pratiques

✅ **UX/UI (20%)**
- Design responsive
- Feedback utilisateur
- Navigation intuitive

✅ **Documentation (10%)**
- README clair
- Commentaires pertinents
- Rapport complet

---

## 🎤 Questions fréquentes (FAQ)

**Q: Pourquoi Redux Toolkit et pas Redux classique ?**  
R: Moins de boilerplate, APIs simplifiées (createSlice, createAsyncThunk), Immer intégré.

**Q: Comment fonctionnent les thunks ?**  
R: Middleware qui permet d'écrire des actions asynchrones. Retourne une fonction au lieu d'un objet.

**Q: Pourquoi localStorage pour les favoris ?**  
R: Persistance simple sans backend. Alternative : Redux Persist.

**Q: Comment sécuriser la clé API ?**  
R: En production : backend proxy. Ici : côté client pour la simplicité.

**Q: Comment ajouter des tests ?**  
R: Jest + React Testing Library pour les composants, tests d'intégration pour Redux.

---

## 🎓 Ressources supplémentaires

- [Redux Toolkit Tutorial](https://redux-toolkit.js.org/tutorials/overview)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [OpenWeatherMap API Docs](https://openweathermap.org/api)

---

**Bon courage pour la soutenance ! 🚀**
