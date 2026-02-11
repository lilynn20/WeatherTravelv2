# 🔧 RÉSOLUTION PROBLÈME EMAIL - Guide Urgent

## ⚠️ Problème : Les emails sont envoyés à la mauvaise adresse

### Cause
Dans votre template EmailJS, le champ "To Email" est probablement configuré avec une adresse email fixe (la vôtre) au lieu d'utiliser la variable dynamique `{{to_email}}`.

---

## ✅ SOLUTION IMMÉDIATE

### Étape 1 : Aller sur EmailJS Dashboard
1. Connectez-vous sur [https://dashboard.emailjs.com/](https://dashboard.emailjs.com/)
2. Cliquez sur **"Email Templates"** dans le menu de gauche

### Étape 2 : Modifier votre template
1. Trouvez votre template (probablement `template_z12uqc8`)
2. Cliquez sur **"Edit"** (icône crayon)

### Étape 3 : CRITIQUE - Configurer le destinataire correctement

Dans la section **"To Email"**, vous devez voir quelque chose comme :

❌ **MAUVAIS** (email fixe) :
```
votre.email@gmail.com
```

✅ **CORRECT** (variable dynamique) :
```
{{to_email}}
```

**IMPORTANT :** Remplacez votre email fixe par exactement `{{to_email}}` (avec les doubles accolades)

### Étape 4 : Vérifier les autres champs

Assurez-vous que ces champs sont configurés comme suit :

**From Name:**
```
WeatherTravel
```

**From Email:**
```
votre.email.emailjs@gmail.com
```
(ou l'email que vous avez configuré avec EmailJS)

**Reply To:**
```
{{to_email}}
```
(optionnel mais recommandé - permet au destinataire de répondre)

### Étape 5 : Sauvegarder
Cliquez sur **"Save"** en haut à droite

---

## 🧪 TESTER LA CONFIGURATION

### Test 1 : Template Test sur EmailJS
1. Dans le template editor, cliquez sur **"Test it"**
2. Remplissez les champs de test :
   ```
   to_email: votre.email.de.test@gmail.com
   to_name: Test User
   city_name: Paris
   travel_date: 15 mars 2025
   days_until_travel: 10
   temperature: 15°C
   description: Ensoleillé
   humidity: 60%
   wind_speed: 10 km/h
   feels_like: 14°C
   advice: Beau temps prévu !
   packing_tips: Vêtements légers
   ```
3. Cliquez sur **"Send test email"**
4. **Vérifiez** que l'email arrive bien à `votre.email.de.test@gmail.com` (PAS à votre email principal)

### Test 2 : Depuis l'application
1. Ouvrez l'application WeatherTravel
2. Recherchez une ville (ex: "Tokyo")
3. Cliquez sur "Planifier un voyage"
4. Entrez une adresse email différente de la vôtre
5. Soumettez le formulaire
6. **Vérifiez** que l'email arrive à l'adresse que vous avez entrée

---

## 📋 CONFIGURATION COMPLÈTE DU TEMPLATE

Voici la configuration complète recommandée :

### Section "Settings"

**Template Name:**
```
WeatherTravel Reminder
```

**Template ID:** (généré automatiquement)
```
template_z12uqc8
```

**To Email:** ⚠️ CRITIQUE
```
{{to_email}}
```

**From Name:**
```
WeatherTravel
```

**From Email:**
```
votre.email@gmail.com
```

**Reply To:**
```
{{to_email}}
```

**BCC:** (laisser vide ou mettre votre email si vous voulez une copie)
```

```

### Section "Content" (Subject)

**Subject:**
```
🌍 Rappel : Votre voyage à {{city_name}} dans {{days_until_travel}} jours !
```

### Section "Content" (HTML Body)

Voir le fichier `EMAIL_SETUP.md` pour le template HTML complet.

---

## 🔍 VÉRIFICATION FINALE

### Checklist de vérification :

- [ ] Template modifié avec `{{to_email}}`
- [ ] Template sauvegardé
- [ ] Test effectué depuis EmailJS dashboard
- [ ] Email de test reçu à la bonne adresse
- [ ] Test effectué depuis l'application
- [ ] Email reçu à l'adresse saisie dans le formulaire
- [ ] Pas de copie reçue à votre email principal (sauf si BCC configuré)

---

## 🐛 PROBLÈMES PERSISTANTS ?

### Problème 1 : L'email n'arrive toujours pas à la bonne adresse

**Solution A :** Vider le cache du navigateur
```bash
Ctrl + Shift + Delete (Windows)
Cmd + Shift + Delete (Mac)
```
Puis recharger l'application.

**Solution B :** Vérifier les logs EmailJS
1. Dashboard EmailJS → "Email History"
2. Cliquez sur le dernier email envoyé
3. Vérifiez le champ "To" dans les détails

**Solution C :** Recréer le template
1. Créer un nouveau template depuis zéro
2. Copier l'ID du nouveau template
3. Mettre à jour `TEMPLATE_ID` dans `emailService.js`

### Problème 2 : Variable {{to_email}} apparaît littéralement dans l'email

**Cause :** Le code JavaScript n'envoie pas la variable correctement.

**Solution :** Vérifier `emailService.js` ligne 64 :
```javascript
const templateParams = {
  to_email: userEmail,  // ← Doit être exactement comme ça
  // ...
};
```

### Problème 3 : Emails vont dans les spams

**Solutions :**
1. Ajouter `noreply@votredomaine.com` aux contacts
2. Vérifier SPF/DKIM dans EmailJS (section Email Services)
3. Demander aux destinataires de marquer comme "Non spam"

---

## 📊 LOGS DE DÉBOGAGE

Pour déboguer, ajoutez temporairement ces logs dans `emailService.js` :

```javascript
async sendTravelReminder({ cityName, travelDate, userEmail, weatherInfo }) {
  // ... code existant ...

  const templateParams = {
    to_email: userEmail,
    // ...
  };

  // AJOUTER CES LOGS TEMPORAIREMENT
  console.log('=== DEBUG EMAIL ===');
  console.log('Email destinataire:', userEmail);
  console.log('Template params:', templateParams);
  console.log('==================');

  const response = await emailjs.send(
    EMAILJS_CONFIG.SERVICE_ID,
    EMAILJS_CONFIG.TEMPLATE_ID,
    templateParams
  );

  // ... reste du code ...
}
```

Puis vérifiez la console du navigateur (F12) pour voir les valeurs.

---

## 🎯 RÉSUMÉ RAPIDE

### Le problème en 1 phrase :
Le template EmailJS envoie à une adresse fixe au lieu d'utiliser la variable `{{to_email}}`.

### La solution en 3 étapes :
1. Aller sur EmailJS Dashboard → Email Templates
2. Modifier le template → Changer "To Email" de `votre@email.com` à `{{to_email}}`
3. Sauvegarder et tester

---

## 📞 SUPPORT

Si le problème persiste après ces étapes :

1. **Vérifier la documentation EmailJS officielle :**
   https://www.emailjs.com/docs/

2. **Contacter le support EmailJS :**
   https://www.emailjs.com/support/

3. **Vérifier les paramètres du service email :**
   Dashboard → Email Services → Votre service → Settings

---

**Temps estimé de résolution : 5-10 minutes** ⏱️

Bonne chance ! 🚀
