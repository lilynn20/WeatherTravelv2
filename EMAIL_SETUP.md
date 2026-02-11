# 📧 CONFIGURATION EMAIL - Guide Complet

## 📋 Vue d'ensemble

La nouvelle fonctionnalité de **rappels email** permet aux utilisateurs de :
- Planifier des voyages avec des dates spécifiques
- Recevoir automatiquement des emails de rappel avec les informations météo
- Gérer leurs voyages planifiés depuis le dashboard

## 🎯 Nouvelles fonctionnalités ajoutées

### 1. Planification de voyage
- ✅ Sélection de date de voyage (interface calendrier)
- ✅ Saisie d'email pour les rappels
- ✅ Stockage persistant dans localStorage
- ✅ Visualisation des voyages à venir et passés

### 2. Système d'email automatique
- ✅ Envoi d'emails avec EmailJS (service gratuit)
- ✅ Template personnalisé avec météo et conseils
- ✅ Gestion des erreurs et confirmation d'envoi
- ✅ Possibilité de renvoyer les emails

## 🚀 Installation et Configuration

### Étape 1 : Installer les dépendances

```bash
cd weathertravel
npm install
```

La nouvelle dépendance `@emailjs/browser` sera installée automatiquement.

### Étape 2 : Créer un compte EmailJS (GRATUIT)

1. **Aller sur** : https://www.emailjs.com/
2. **Créer un compte gratuit** (100 emails/mois inclus)
3. **Connectez-vous** à votre dashboard

### Étape 3 : Configurer EmailJS

#### A. Ajouter un service email

1. Dans le dashboard EmailJS, cliquez sur **"Email Services"**
2. Cliquez sur **"Add New Service"**
3. Choisissez votre fournisseur (Gmail recommandé)
4. Suivez les instructions pour connecter votre compte
5. **Notez le Service ID** (ex: `service_abc123`)

#### B. Créer un template d'email

1. Cliquez sur **"Email Templates"**
2. Cliquez sur **"Create New Template"**
3. Utilisez le template suivant :

**Sujet de l'email :**
```
🌍 Rappel : Votre voyage à {{city_name}} dans {{days_until_travel}} jours !
```

**Corps de l'email (HTML) :**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .weather-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .weather-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
        .weather-item { background: #f0f0f0; padding: 10px; border-radius: 5px; }
        .advice-box { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✈️ Votre voyage approche !</h1>
            <h2>{{city_name}}</h2>
            <p style="font-size: 18px; margin-top: 10px;">📅 {{travel_date}}</p>
            <p style="font-size: 16px; opacity: 0.9;">Dans {{days_until_travel}} jours</p>
        </div>
        
        <div class="content">
            <p>Bonjour {{to_name}} ! 👋</p>
            
            <p>Votre voyage à <strong>{{city_name}}</strong> approche ! Voici les informations météo actuelles pour vous aider à préparer vos bagages.</p>
            
            <div class="weather-box">
                <h3>🌤️ Conditions météo</h3>
                <div class="weather-grid">
                    <div class="weather-item">
                        <strong>🌡️ Température</strong><br>
                        {{temperature}}
                    </div>
                    <div class="weather-item">
                        <strong>🤚 Ressenti</strong><br>
                        {{feels_like}}
                    </div>
                    <div class="weather-item">
                        <strong>☁️ Conditions</strong><br>
                        {{description}}
                    </div>
                    <div class="weather-item">
                        <strong>💧 Humidité</strong><br>
                        {{humidity}}
                    </div>
                    <div class="weather-item">
                        <strong>🌬️ Vent</strong><br>
                        {{wind_speed}}
                    </div>
                </div>
            </div>
            
            <div class="advice-box">
                <h3>💡 Conseil de voyage</h3>
                <p>{{advice}}</p>
            </div>
            
            <div class="advice-box" style="background: #fff3e0;">
                <h3>🎒 À ne pas oublier</h3>
                <p>{{packing_tips}}</p>
            </div>
            
            <p><strong>Rappel important :</strong> Vérifiez la météo quelques jours avant votre départ, car les prévisions peuvent évoluer !</p>
            
            <div style="text-align: center;">
                <a href="https://www.weathertravel.com" class="button">Consulter WeatherTravel</a>
            </div>
        </div>
        
        <div class="footer">
            <p>Cet email a été envoyé automatiquement par WeatherTravel.</p>
            <p>Bon voyage ! 🌍✈️</p>
        </div>
    </div>
</body>
</html>
```

4. **Notez le Template ID** (ex: `template_z12uqc8`)

#### C. Obtenir la clé publique

1. Allez dans **"Account"** > **"General"**
2. Copiez votre **Public Key** (ex: `fwJI8O9s8RVkJ0i16`)

### Étape 4 : Configurer l'application

Ouvrez le fichier `/src/features/travelPlans/emailService.js` et remplacez les valeurs :

```javascript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_abc123',      // Votre Service ID
  TEMPLATE_ID: 'template_xyz789',    // Votre Template ID
  PUBLIC_KEY: 'user_def456',         // Votre Public Key
};
```

### Étape 5 : Tester l'application

```bash
npm run dev
```

Visitez `http://localhost:5173` et :

1. Recherchez une ville (ex: "Paris")
2. Cliquez sur **"✈️ Planifier un voyage"**
3. Sélectionnez une date future
4. Entrez votre email
5. Cliquez sur **"Planifier le voyage"**
6. Vérifiez votre boîte mail !

## 📊 Structure des nouveaux fichiers

```
src/
├── features/
│   └── travelPlans/
│       ├── travelPlansSlice.js      # Redux slice pour les plans
│       └── emailService.js          # Service d'envoi d'emails
├── components/
│   ├── TravelDateModal.jsx          # Modal de planification
│   └── TravelPlanCard.jsx           # Carte d'affichage de plan
├── pages/
│   └── Dashboard.jsx                # Mis à jour avec onglets
└── app/
    └── store.js                     # Store Redux mis à jour
```

## 🎨 Nouvelles fonctionnalités UI

### 1. WeatherCard
- Nouveau bouton **"✈️ Planifier un voyage"**
- Ouvre un modal avec formulaire de date et email

### 2. TravelDateModal
- Sélecteur de date (calendrier natif)
- Champ email avec validation
- Checkbox pour activer/désactiver l'email
- Aperçu météo en temps réel
- Messages de succès/erreur

### 3. Dashboard
- **Onglets** : "Favoris" et "Voyages planifiés"
- Séparation automatique : voyages à venir / passés
- Cartes avec compte à rebours
- Bouton "Renvoyer" pour les emails
- Statistiques par onglet

### 4. TravelPlanCard
- Badge de statut (aujourd'hui, dans X jours, passé)
- Affichage des infos météo
- Statut d'envoi d'email
- Actions : Renvoyer / Supprimer

## 🔧 Fonctionnement technique

### Flux de données

```
1. User clique "Planifier un voyage"
   ↓
2. Modal s'ouvre avec formulaire
   ↓
3. User remplit date + email
   ↓
4. Soumission → Dispatch addTravelPlan()
   ↓
5. Plan sauvegardé dans Redux + localStorage
   ↓
6. Si email activé → Dispatch scheduleEmailReminder()
   ↓
7. EmailJS envoie l'email
   ↓
8. Confirmation + mise à jour du statut
   ↓
9. User voit le plan dans Dashboard
```

### Persistance

- **localStorage** : `weathertravel_plans`
- Automatique à chaque modification
- Chargement au démarrage de l'app

### Validation

- Date : doit être dans le futur
- Email : format valide (regex)
- Formulaire : désactivé pendant l'envoi

## 📧 Template d'email

L'email envoyé contient :
- 🎯 Nom de la ville et date de voyage
- ⏰ Compte à rebours (jours restants)
- 🌤️ Météo actuelle (temp, ressenti, conditions)
- 💡 Conseils personnalisés basés sur la météo
- 🎒 Liste de bagages suggérée
- 🔗 Lien vers l'application

## ⚠️ Limitations EmailJS (plan gratuit)

- **100 emails/mois** maximum
- Pas de scheduling automatique (envoi immédiat)
- Pas de pièces jointes

### Solutions alternatives

Pour le scheduling automatique :
1. **Solution backend** : Node.js + node-cron + Nodemailer
2. **Services cloud** : AWS SES, SendGrid, Mailgun
3. **Zapier/IFTTT** : Automatisations

## 🐛 Dépannage

### Erreur : "EmailJS n'est pas configuré"
➡️ Vérifiez que les 3 clés sont bien remplies dans `emailService.js`

### Email non reçu
➡️ Vérifiez vos spams
➡️ Vérifiez la console pour des erreurs
➡️ Testez le template directement sur EmailJS

### Erreur CORS
➡️ EmailJS gère CORS automatiquement, pas de config nécessaire

### Erreur 403
➡️ Vérifiez votre quota (100/mois)
➡️ Vérifiez que votre Public Key est correcte

## 🚀 Améliorations futures possibles

- [ ] Scheduler automatique (envoyer X jours avant)
- [ ] Notifications push (PWA)
- [ ] Export iCal/Google Calendar
- [ ] Rappels multiples (7j, 3j, 1j avant)
- [ ] Historique des emails envoyés
- [ ] Prévisions météo dans l'email (API forecast)
- [ ] Templates d'email personnalisables
- [ ] Intégration SMS (Twilio)

## 📚 Ressources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [React Hook Form](https://react-hook-form.com/) (validation avancée)
- [Nodemailer](https://nodemailer.com/) (backend alternatif)
- [SendGrid](https://sendgrid.com/) (service professionnel)

---

**Bon voyage avec WeatherTravel ! ✈️🌍**
