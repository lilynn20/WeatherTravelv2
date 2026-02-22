const axios = require("axios");

/**
 * AI-Powered Travel Recommendation Engine
 * Uses weather patterns, historical data, and user preferences
 */

// Destination database with optimal conditions
const destinations = [
  {
    city: "Miami",
    country: "USA",
    climate: "tropical",
    optimalTemp: { min: 24, max: 30 },
    activities: ["beach", "water sports", "nightlife"],
    bestMonths: [11, 12, 1, 2, 3, 4],
    tags: ["warm", "humid", "sunny"]
  },
  {
    city: "Denver",
    country: "USA",
    climate: "continental",
    optimalTemp: { min: 15, max: 25 },
    activities: ["hiking", "skiing", "mountains"],
    bestMonths: [6, 7, 8, 9],
    tags: ["mild", "dry", "mountains"]
  },
  {
    city: "Seattle",
    country: "USA",
    climate: "oceanic",
    optimalTemp: { min: 12, max: 22 },
    activities: ["culture", "coffee", "nature"],
    bestMonths: [6, 7, 8, 9],
    tags: ["cool", "rainy", "green"]
  },
  {
    city: "Barcelona",
    country: "Spain",
    climate: "mediterranean",
    optimalTemp: { min: 18, max: 28 },
    activities: ["beach", "culture", "food"],
    bestMonths: [5, 6, 9, 10],
    tags: ["warm", "sunny", "coastal"]
  },
  {
    city: "Tokyo",
    country: "Japan",
    climate: "humid subtropical",
    optimalTemp: { min: 15, max: 25 },
    activities: ["culture", "food", "technology"],
    bestMonths: [3, 4, 10, 11],
    tags: ["seasonal", "varied", "urban"]
  },
  {
    city: "Reykjavik",
    country: "Iceland",
    climate: "subarctic",
    optimalTemp: { min: 8, max: 15 },
    activities: ["northern lights", "geothermal", "nature"],
    bestMonths: [6, 7, 8],
    tags: ["cold", "unique", "adventure"]
  },
  {
    city: "Dubai",
    country: "UAE",
    climate: "desert",
    optimalTemp: { min: 20, max: 35 },
    activities: ["luxury", "shopping", "desert"],
    bestMonths: [11, 12, 1, 2, 3],
    tags: ["hot", "dry", "luxury"]
  },
  {
    city: "Paris",
    country: "France",
    climate: "oceanic",
    optimalTemp: { min: 15, max: 25 },
    activities: ["culture", "food", "romance"],
    bestMonths: [4, 5, 6, 9, 10],
    tags: ["mild", "romantic", "cultural"]
  }
];

/**
 * Calculate comprehensive travel score for a destination
 */
exports.calculateTravelScore = (weatherData, preferences = {}) => {
  const scores = {
    temperature: 0,
    humidity: 0,
    windSpeed: 0,
    cloudiness: 0,
    precipitation: 0,
    overall: 0
  };

  const temp = weatherData.main?.temp;
  const humidity = weatherData.main?.humidity;
  const windSpeed = weatherData.wind?.speed;
  const clouds = weatherData.clouds?.all;
  const rain = weatherData.rain?.['1h'] || 0;

  // Temperature scoring (0-10)
  const preferredTempMin = preferences.tempMin || 18;
  const preferredTempMax = preferences.tempMax || 28;
  
  if (temp >= preferredTempMin && temp <= preferredTempMax) {
    scores.temperature = 10;
  } else if (temp >= preferredTempMin - 5 && temp <= preferredTempMax + 5) {
    scores.temperature = 7;
  } else if (temp >= preferredTempMin - 10 && temp <= preferredTempMax + 10) {
    scores.temperature = 4;
  } else {
    scores.temperature = 2;
  }

  // Humidity scoring (0-10)
  if (humidity < 50) {
    scores.humidity = 10;
  } else if (humidity < 65) {
    scores.humidity = 8;
  } else if (humidity < 80) {
    scores.humidity = 5;
  } else {
    scores.humidity = 3;
  }

  // Wind speed scoring (0-10)
  if (windSpeed < 5) {
    scores.windSpeed = 10;
  } else if (windSpeed < 10) {
    scores.windSpeed = 7;
  } else if (windSpeed < 15) {
    scores.windSpeed = 4;
  } else {
    scores.windSpeed = 2;
  }

  // Cloudiness scoring (0-10)
  if (clouds < 20) {
    scores.cloudiness = 10;
  } else if (clouds < 50) {
    scores.cloudiness = 7;
  } else if (clouds < 80) {
    scores.cloudiness = 5;
  } else {
    scores.cloudiness = 3;
  }

  // Precipitation scoring (0-10)
  if (rain === 0) {
    scores.precipitation = 10;
  } else if (rain < 1) {
    scores.precipitation = 6;
  } else if (rain < 3) {
    scores.precipitation = 3;
  } else {
    scores.precipitation = 1;
  }

  // Calculate weighted overall score
  scores.overall = (
    scores.temperature * 0.35 +
    scores.humidity * 0.20 +
    scores.windSpeed * 0.15 +
    scores.cloudiness * 0.15 +
    scores.precipitation * 0.15
  );

  return {
    scores,
    rating: Math.round(scores.overall * 10) / 10,
    recommendation: getRecommendationText(scores.overall)
  };
};

/**
 * Get recommendation text based on score
 */
function getRecommendationText(score) {
  if (score >= 9) return "Perfect conditions! Ideal time to visit.";
  if (score >= 8) return "Excellent conditions for travel.";
  if (score >= 7) return "Very good weather conditions.";
  if (score >= 6) return "Good conditions for most activities.";
  if (score >= 5) return "Acceptable conditions, plan accordingly.";
  if (score >= 4) return "Fair conditions, some activities may be affected.";
  if (score >= 3) return "Below average conditions, consider alternatives.";
  return "Poor conditions, not recommended for travel.";
}

/**
 * AI-powered destination recommendations
 */
exports.getSmartRecommendations = async (preferences) => {
  const { 
    climate, 
    activities = [], 
    budget, 
    tempMin = 18, 
    tempMax = 28,
    currentMonth = new Date().getMonth() + 1
  } = preferences;

  // Filter destinations based on preferences
  let matches = destinations.filter(dest => {
    let score = 0;

    // Climate match
    if (climate && dest.climate.includes(climate)) score += 3;
    
    // Activity match
    const activityMatches = activities.filter(act => 
      dest.activities.includes(act)
    ).length;
    score += activityMatches * 2;

    // Best month match
    if (dest.bestMonths.includes(currentMonth)) score += 2;

    return score > 0;
  });

  // Sort by match score and return top recommendations
  matches = matches.slice(0, 8);

  // Enhance with current weather data
  const enriched = await Promise.all(
    matches.map(async (dest) => {
      try {
        const weatherData = await getWeatherData(dest.city);
        const travelScore = exports.calculateTravelScore(weatherData, { tempMin, tempMax });
        
        return {
          ...dest,
          currentWeather: {
            temp: weatherData.main?.temp,
            description: weatherData.weather?.[0]?.description,
            humidity: weatherData.main?.humidity
          },
          travelScore: travelScore.rating,
          recommendation: travelScore.recommendation
        };
      } catch (err) {
        return {
          ...dest,
          travelScore: null,
          recommendation: "Weather data unavailable"
        };
      }
    })
  );

  // Sort by travel score
  enriched.sort((a, b) => (b.travelScore || 0) - (a.travelScore || 0));

  return enriched;
};

/**
 * Analyze best travel time for a specific city
 */
exports.analyzeBestTravelTime = (weatherData) => {
  const analysis = exports.calculateTravelScore(weatherData);
  
  return {
    score: analysis.rating,
    recommendation: analysis.recommendation,
    details: analysis.scores,
    bestFor: determineBestActivities(weatherData),
    warnings: getWeatherWarnings(weatherData)
  };
};

/**
 * Determine best activities based on weather
 */
function determineBestActivities(weatherData) {
  const activities = [];
  const temp = weatherData.main?.temp;
  const rain = weatherData.rain?.['1h'] || 0;
  const clouds = weatherData.clouds?.all;

  if (temp >= 20 && temp <= 30 && rain === 0) {
    activities.push("outdoor dining", "sightseeing", "beach");
  }
  if (temp >= 15 && temp <= 25) {
    activities.push("hiking", "cycling", "photography");
  }
  if (clouds < 30 && rain === 0) {
    activities.push("outdoor activities", "picnics");
  }
  if (rain > 0 || clouds > 70) {
    activities.push("museums", "indoor attractions", "shopping");
  }
  if (temp < 10) {
    activities.push("winter sports", "cozy cafes", "indoor entertainment");
  }

  return activities;
}

/**
 * Get weather warnings
 */
function getWeatherWarnings(weatherData) {
  const warnings = [];
  const temp = weatherData.main?.temp;
  const windSpeed = weatherData.wind?.speed;
  const rain = weatherData.rain?.['1h'] || 0;

  if (temp > 35) warnings.push("Extreme heat - stay hydrated");
  if (temp < 0) warnings.push("Freezing temperatures - dress warmly");
  if (windSpeed > 15) warnings.push("Strong winds - be cautious outdoors");
  if (rain > 5) warnings.push("Heavy rain - bring rain gear");

  return warnings;
}

/**
 * Get weather data for a city
 */
async function getWeatherData(city) {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
  );
  return response.data;
}

/**
 * Compare multiple destinations
 */
exports.compareDestinations = async (cities) => {
  const comparisons = await Promise.all(
    cities.map(async (city) => {
      try {
        const weatherData = await getWeatherData(city);
        const score = exports.calculateTravelScore(weatherData);
        
        return {
          city,
          score: score.rating,
          temp: weatherData.main?.temp,
          conditions: weatherData.weather?.[0]?.description,
          recommendation: score.recommendation
        };
      } catch (err) {
        return {
          city,
          error: "Data unavailable"
        };
      }
    })
  );

  comparisons.sort((a, b) => (b.score || 0) - (a.score || 0));
  return comparisons;
};
