# 🚀 DÉMARRAGE RAPIDE - WeatherTravel v2.0

## ⚡ Installation en 4 étapes

### 1️⃣ Installer les dépendances

```bash
cd weathertravel
npm install
```

### 2️⃣ Configurer la clé API OpenWeatherMap

1. Créer un compte gratuit sur [OpenWeatherMap](https://openweathermap.org/api)
2. Obtenir votre clé API
3. Ouvrir `src/utils/constants.js`
4. Remplacer :
   ```javascript
   export const WEATHER_API_KEY = 'VOTRE_CLE_API_ICI';
   ```

### 3️⃣ 🆕 Configurer EmailJS (OPTIONNEL - pour les rappels email)

**Option A : Configuration complète** (recommandé)
1. Créer un compte sur [EmailJS](https://www.emailjs.com/)
2. Suivre le guide détaillé dans [EMAIL_SETUP.md](./EMAIL_SETUP.md)
3. Configurer vos clés dans `src/features/travelPlans/emailService.js`

**Option B : Tester sans email**
- Vous pouvez utiliser l'app sans configurer EmailJS
- La planification de voyage fonctionnera
- Décochez simplement "Recevoir un rappel par email" dans le formulaire

### 4️⃣ Lancer l'application

```bash
npm run dev
```

Ouvrir : `http://localhost:5173`

---

## 📋 Checklist de vérification v2.0

Avant de tester, vérifier que :

### Installation
- [ ] Les dépendances sont installées (`node_modules/` existe)
- [ ] La clé API OpenWeatherMap est configurée dans `constants.js`
- [ ] L'application se lance sans erreur (`npm run dev`)

### Fonctionnalités de base
- [ ] La recherche de ville fonctionne
- [ ] L'ajout aux favoris fonctionne
- [ ] La navigation entre les pages fonctionne
- [ ] Les erreurs s'affichent correctement
- [ ] Le responsive design fonctionne (tester sur mobile)

### 🆕 Nouvelles fonctionnalités
- [ ] Le bouton "Planifier un voyage" apparaît sur WeatherCard
- [ ] Le modal de planification s'ouvre
- [ ] La sélection de date fonctionne
- [ ] L'onglet "Voyages planifiés" dans le Dashboard fonctionne
- [ ] Les plans sont sauvegardés après rechargement
- [ ] Le compte à rebours s'affiche correctement
- [ ] (Si EmailJS configuré) Les emails sont envoyés

---

## 🎯 Test rapide des nouvelles fonctionnalités

### Scénario 1 : Planifier un voyage SANS email

1. **Rechercher** : "Tokyo"
2. **Cliquer** : "✈️ Planifier un voyage"
3. **Sélectionner** : Une date future (ex: dans 7 jours)
4. **Décocher** : "Recevoir un rappel par email"
5. **Soumettre** : Cliquer "Planifier le voyage"
6. **Vérifier** : Aller dans Dashboard > Voyages planifiés
7. **Confirmer** : Le voyage apparaît avec compte à rebours

### Scénario 2 : Planifier un voyage AVEC email (EmailJS configuré)

1. **Rechercher** : "Paris"
2. **Cliquer** : "✈️ Planifier un voyage"
3. **Sélectionner** : Une date future
4. **Cocher** : "Recevoir un rappel par email"
5. **Entrer** : Votre adresse email
6. **Soumettre** : Cliquer "Planifier le voyage"
7. **Attendre** : Message "Voyage planifié avec succès !"
8. **Vérifier** : Votre boîte email (et spams)
9. **Confirmer** : Email reçu avec météo et conseils

### Scénario 3 : Gestion des voyages planifiés

1. **Aller** : Dashboard > Voyages planifiés
2. **Observer** : Séparation "À venir" / "Passés"
3. **Tester** : Cliquer "Renvoyer" sur un voyage
4. **Tester** : Cliquer "Supprimer" sur un voyage
5. **Vérifier** : Les changements sont persistés

---

## 🎤 Points clés pour la soutenance v2.0

### Architecture Redux (3 slices maintenant)

```
Store
├── weather slice
│   ├── currentWeather
│   ├── forecast
│   ├── loading
│   └── error
├── favorites slice
│   └── cities []
└── 🆕 travelPlans slice
    ├── plans []
    ├── loading
    ├── emailSending
    ├── emailSent
    └── error
```

### Nouveaux flux de données

**Flux de planification de voyage :**
```
User action → Open modal
            → Fill form (date + email)
            → Dispatch addTravelPlan()
            → Save to localStorage
            → If email enabled → Dispatch scheduleEmailReminder()
            → EmailJS sends email
            → Update state (reminderSent: true)
            → Display in Dashboard
```

### Code à montrer (nouveaux fichiers)

1. **travelPlansSlice.js** - Ligne 5-20 (scheduleEmailReminder thunk)
2. **emailService.js** - Ligne 30-80 (sendTravelReminder + conseils)
3. **TravelDateModal.jsx** - Ligne 60-140 (formulaire et validation)
4. **Dashboard.jsx** - Ligne 40-80 (onglets et tri des plans)
5. **TravelPlanCard.jsx** - Ligne 15-35 (compte à rebours)

---

## 🐛 Dépannage rapide v2.0

### Erreur : "EmailJS n'est pas configuré"
➡️ **Solution 1** : Configurer EmailJS en suivant [EMAIL_SETUP.md](./EMAIL_SETUP.md)  
➡️ **Solution 2** : Décocher "Recevoir un rappel par email" dans le formulaire

### Les plans ne se sauvent pas
➡️ Vérifier que le localStorage n'est pas désactivé dans le navigateur  
➡️ Vérifier la console pour des erreurs

### Modal ne s'ouvre pas
➡️ Vérifier que TravelDateModal est bien importé dans WeatherCard  
➡️ Vérifier la console navigateur

### Email non reçu
➡️ Vérifier les spams  
➡️ Vérifier que les 3 clés EmailJS sont configurées  
➡️ Tester le template directement sur emailjs.com  
➡️ Vérifier le quota (100 emails/mois gratuit)

### Compte à rebours incorrect
➡️ Vérifier que la date sélectionnée est dans le futur  
➡️ Vérifier le fuseau horaire de votre navigateur

---

## 📱 Test de démonstration complet v2.0

Scénario de démo suggéré (durée : 10 min) :

1. **Recherche basique** : "Paris" → Météo affichée *(30s)*

2. **🆕 Planification** : Cliquer "Planifier un voyage" → Modal s'ouvre *(30s)*

3. **🆕 Formulaire** : 
   - Sélectionner date (dans 7 jours)
   - Entrer email
   - Montrer la validation (date passée = erreur)
   - Soumettre *(2 min)*

4. **🆕 Email** : Montrer l'email reçu (préparer à l'avance) *(1 min)*

5. **🆕 Dashboard onglets** : 
   - Onglet Favoris
   - Onglet Voyages planifiés *(1 min)*

6. **🆕 Compte à rebours** : Montrer les badges de statut *(1 min)*

7. **🆕 Gestion** : 
   - Renvoyer un email
   - Supprimer un plan *(1 min)*

8. **Détails** : Cliquer sur Paris → Prévisions 5 jours *(1 min)*

9. **Géolocalisation** : Tester "Utiliser ma position" *(1 min)*

10. **Erreur** : Chercher "xyzabc" → Message d'erreur *(30s)*

11. **404** : Aller sur `/route-inexistante` *(30s)*

---

## 📊 Critères d'évaluation attendus v2.0

✅ **Fonctionnel (40%)**
- Routes fonctionnelles *(existant)*
- Redux opérationnel *(existant)*
- API intégrée *(existant)*
- Formulaire validé *(existant)*
- 🆕 **Planification de voyage**
- 🆕 **Persistance des plans**
- 🆕 **Intégration EmailJS**

✅ **Technique (30%)**
- Code propre et structuré *(existant)*
- Gestion d'erreurs *(existant)*
- États asynchrones *(existant)*
- Bonnes pratiques *(existant)*
- 🆕 **Service email modulaire**
- 🆕 **Validation avancée (date, email)**

✅ **UX/UI (20%)**
- Design responsive *(existant)*
- Feedback utilisateur *(existant)*
- Navigation intuitive *(existant)*
- 🆕 **Modal moderne et accessible**
- 🆕 **Onglets clairs**
- 🆕 **Badges de statut visuels**

✅ **Documentation (10%)**
- README clair *(existant)*
- Commentaires pertinents *(existant)*
- Rapport complet *(existant)*
- 🆕 **Guide EMAIL_SETUP.md**

---

## 🎤 Questions fréquentes (FAQ) v2.0

### Questions existantes

**Q: Pourquoi Redux Toolkit et pas Redux classique ?**  
R: Moins de boilerplate, APIs simplifiées (createSlice, createAsyncThunk), Immer intégré.

**Q: Comment fonctionnent les thunks ?**  
R: Middleware qui permet d'écrire des actions asynchrones. Retourne une fonction au lieu d'un objet.

### 🆕 Nouvelles questions

**Q: Pourquoi EmailJS et pas un backend ?**  
R: 
- Simplicité : Pas besoin de serveur
- Gratuit : 100 emails/mois
- Sécurité : Pas de clés côté client (domain whitelisting)
- Rapidité : Configuration en 5 minutes
- Alternative professionnelle : SendGrid, Mailgun, backend Node.js

**Q: Comment fonctionne le scheduling des emails ?**  
R: 
- Actuellement : Envoi immédiat à la planification
- Production : Backend avec node-cron ou services cloud
- Alternative : Workers Cloudflare, AWS Lambda

**Q: Comment valider la date et l'email ?**  
R:
- Date : `new Date()` + comparaison avec aujourd'hui
- Email : Regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- HTML5 : `type="date"` et `type="email"` ajoutent validation native

**Q: Pourquoi séparer les plans à venir et passés ?**  
R: UX - L'utilisateur veut voir en priorité ses voyages futurs. Les passés servent d'historique.

**Q: Comment gérer plusieurs plans pour la même ville ?**  
R: Chaque plan a un ID unique (timestamp). On peut planifier plusieurs voyages à Paris à des dates différentes.

**Q: Comment tester sans configurer EmailJS ?**  
R: Décocher "Recevoir un rappel par email". La planification fonctionne, juste pas d'email envoyé.

**Q: Peut-on personnaliser le template d'email ?**  
R: Oui ! Sur EmailJS dashboard, modifier le template HTML. Variables disponibles listées dans EMAIL_SETUP.md.

---

## 🎓 Ressources supplémentaires v2.0

### Existantes
- [Redux Toolkit Tutorial](https://redux-toolkit.js.org/tutorials/overview)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [OpenWeatherMap API Docs](https://openweathermap.org/api)

### 🆕 Nouvelles
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [HTML5 Date Input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date)
- [Email Regex Validation](https://emailregex.com/)
- [LocalStorage Guide](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

## 📦 Checklist finale v2.0

### Avant la soutenance

#### Technique
- [ ] Application lance sans erreur
- [ ] Toutes les routes fonctionnent
- [ ] Redux DevTools fonctionne
- [ ] Pas d'erreurs dans la console
- [ ] Tests de validation OK
- [ ] 🆕 Modal de planification s'ouvre
- [ ] 🆕 Plans persistent après refresh
- [ ] 🆕 Onglets Dashboard fonctionnent
- [ ] 🆕 (Optionnel) EmailJS configuré et testé

#### Présentation
- [ ] Support de présentation prêt
- [ ] Démo testée et fluide
- [ ] Code à montrer identifié
- [ ] Réponses aux questions préparées
- [ ] Timing respecté (15-20 min)
- [ ] 🆕 Email de démo prêt (capture d'écran)
- [ ] 🆕 Exemples de plans de voyage créés

---

**Bonne chance pour votre projet amélioré ! 🚀✈️**

---

## 🔗 Liens utiles

- [Guide complet EmailJS](./EMAIL_SETUP.md)
- [README v2.0](./README_V2.md)
- [Documentation technique](./RAPPORT.md)
- [Support soutenance](./SOUTENANCE.md)
