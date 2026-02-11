import emailjs from '@emailjs/browser';

// Configuration EmailJS
// IMPORTANT: Créez un compte gratuit sur https://www.emailjs.com/
// Puis remplacez ces valeurs par vos propres clés
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_7yqv0bk',      // Ex: 'service_abc123'
  TEMPLATE_ID: 'template_z12uqc8',    // Ex: 'template_xyz789'
  PUBLIC_KEY: 'fwJI8O9s8RVkJ0i16',      // Ex: 'user_def456'
};

class EmailService {
  constructor() {
    // Initialiser EmailJS uniquement si les clés sont configurées
    if (this.isConfigured()) {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }
  }

  /**
   * Vérifier si EmailJS est configuré
   */
  isConfigured() {
    return (
      EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
      EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
      EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'
    );
  }

  /**
   * Envoyer un email de rappel de voyage
   * @param {Object} params - Paramètres de l'email
   * @param {string} params.cityName - Nom de la ville
   * @param {string} params.travelDate - Date du voyage
   * @param {string} params.userEmail - Email de l'utilisateur
   * @param {Object} params.weatherInfo - Informations météo
   * @returns {Promise} Promesse de l'envoi
   */
  async sendTravelReminder({ cityName, travelDate, userEmail, weatherInfo }) {
    try {
      // Vérifier la configuration
      if (!this.isConfigured()) {
        throw new Error(
          'EmailJS n\'est pas configuré. Veuillez ajouter vos clés dans src/features/travelPlans/emailService.js'
        );
      }

      console.log('📧 Préparation de l\'email...');
      console.log('Destinataire:', userEmail);
      console.log('Ville:', cityName);

      // Formater la date
      const formattedDate = new Date(travelDate).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Calculer les jours restants
      const daysUntilTravel = Math.ceil(
        (new Date(travelDate) - new Date()) / (1000 * 60 * 60 * 24)
      );

      // Préparer les paramètres du template
      const templateParams = {
        to_email: userEmail, // ← IMPORTANT : Cette variable doit correspondre à {{to_email}} dans votre template EmailJS
        to_name: userEmail.split('@')[0], // Utiliser la partie avant @ comme nom
        city_name: cityName,
        travel_date: formattedDate,
        days_until_travel: daysUntilTravel,
        temperature: weatherInfo?.temp ? `${Math.round(weatherInfo.temp)}°C` : 'N/A',
        description: weatherInfo?.description || 'Météo variable',
        humidity: weatherInfo?.humidity ? `${weatherInfo.humidity}%` : 'N/A',
        wind_speed: weatherInfo?.windSpeed ? `${weatherInfo.windSpeed} km/h` : 'N/A',
        feels_like: weatherInfo?.feelsLike ? `${Math.round(weatherInfo.feelsLike)}°C` : 'N/A',
        advice: this.getTravelAdvice(weatherInfo),
        packing_tips: this.getPackingTips(weatherInfo),
      };

      console.log('📋 Paramètres de l\'email:', {
        destinataire: templateParams.to_email,
        ville: templateParams.city_name,
        date: templateParams.travel_date,
      });

      // Envoyer l'email via EmailJS
      console.log('📤 Envoi en cours...');
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      console.log('✅ Email envoyé avec succès!');
      console.log('Réponse EmailJS:', response);
      console.log('⚠️ IMPORTANT: Vérifiez que l\'email a été reçu à:', userEmail);
      console.log('Si l\'email n\'arrive pas à cette adresse, consultez EMAIL_FIX_URGENT.md');
      
      return {
        success: true,
        message: 'Email de rappel envoyé avec succès',
        response,
      };
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
      console.error('Détails de l\'erreur:', error.text || error.message);
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Obtenir un conseil de voyage basé sur la météo
   * @param {Object} weatherInfo - Informations météo
   * @returns {string} Conseil personnalisé
   */
  getTravelAdvice(weatherInfo) {
    if (!weatherInfo) return 'Vérifiez la météo avant de partir !';

    const { temp, description } = weatherInfo;
    const weatherLower = description?.toLowerCase() || '';

    // Conseils basés sur la température
    if (temp < 5) {
      return '🧥 Il fera froid ! N\'oubliez pas vos vêtements chauds, une écharpe et des gants.';
    } else if (temp < 15) {
      return '🧤 Prévoyez une veste légère, les températures seront fraîches.';
    } else if (temp > 30) {
      return '☀️ Il fera très chaud ! Pensez à la crème solaire et restez bien hydraté.';
    }

    // Conseils basés sur les conditions
    if (weatherLower.includes('rain') || weatherLower.includes('pluie')) {
      return '☔ Pluie attendue ! N\'oubliez pas votre parapluie et des vêtements imperméables.';
    } else if (weatherLower.includes('snow') || weatherLower.includes('neige')) {
      return '❄️ Neige prévue ! Équipez-vous en conséquence avec des vêtements chauds.';
    } else if (weatherLower.includes('cloud') || weatherLower.includes('nuage')) {
      return '☁️ Temps nuageux prévu. Une veste légère pourrait être utile.';
    } else if (weatherLower.includes('clear') || weatherLower.includes('ensoleillé')) {
      return '🌤️ Beau temps prévu ! Profitez-en pour explorer la ville.';
    }

    return '🌍 Bon voyage ! Vérifiez la météo la veille de votre départ.';
  }

  /**
   * Obtenir des conseils de bagages
   * @param {Object} weatherInfo - Informations météo
   * @returns {string} Conseils de bagages
   */
  getPackingTips(weatherInfo) {
    if (!weatherInfo) return 'Vérifiez la météo pour préparer vos bagages.';

    const { temp, description } = weatherInfo;
    const weatherLower = description?.toLowerCase() || '';
    const tips = [];

    // Basé sur la température
    if (temp < 0) {
      tips.push('Vêtements thermiques');
      tips.push('Bonnet et gants');
      tips.push('Bottes chaudes');
    } else if (temp < 15) {
      tips.push('Veste ou manteau');
      tips.push('Pull ou sweat');
      tips.push('Pantalon long');
    } else if (temp > 25) {
      tips.push('Vêtements légers');
      tips.push('Chapeau ou casquette');
      tips.push('Lunettes de soleil');
      tips.push('Crème solaire');
    }

    // Basé sur les conditions
    if (weatherLower.includes('rain') || weatherLower.includes('pluie')) {
      tips.push('Parapluie');
      tips.push('Veste imperméable');
    }
    if (weatherLower.includes('snow') || weatherLower.includes('neige')) {
      tips.push('Chaussures imperméables');
      tips.push('Gants chauds');
    }

    return tips.length > 0 ? tips.join(' • ') : 'Préparez vos bagages selon vos besoins.';
  }

  /**
   * Obtenir un message d'erreur lisible
   * @param {Error} error - Erreur à formater
   * @returns {string} Message d'erreur
   */
  getErrorMessage(error) {
    if (error.text) {
      return `Erreur EmailJS: ${error.text}`;
    }
    if (error.message) {
      return error.message;
    }
    return 'Une erreur inattendue s\'est produite lors de l\'envoi de l\'email';
  }
}

// Export d'une instance singleton
const emailService = new EmailService();
export default emailService;
