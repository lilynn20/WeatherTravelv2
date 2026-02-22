const recommendationService = require("../services/recommendationService");
const packingService = require("../services/packingService");
const axios = require("axios");
const cache = require("../services/cacheService");

/**
 * Get AI-powered travel recommendations
 */
exports.getRecommendations = async (req, res, next) => {
  try {
    const preferences = {
      climate: req.query.climate,
      activities: req.query.activities ? req.query.activities.split(",") : [],
      budget: req.query.budget,
      tempMin: parseFloat(req.query.tempMin) || 18,
      tempMax: parseFloat(req.query.tempMax) || 28,
      currentMonth: parseInt(req.query.month) || new Date().getMonth() + 1
    };

    const recommendations = await recommendationService.getSmartRecommendations(preferences);
    
    res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get detailed analysis for a specific city
 */
exports.getDetailedAnalysis = async (req, res, next) => {
  try {
    const { city } = req.params;
    
    // Check cache first
    const cacheKey = `analysis_${city}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Fetch weather data
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    const weatherData = weatherResponse.data;

    // Calculate travel score
    const preferences = {
      tempMin: parseFloat(req.query.tempMin) || 18,
      tempMax: parseFloat(req.query.tempMax) || 28
    };
    
    const travelScore = recommendationService.calculateTravelScore(weatherData, preferences);
    const bestTimeAnalysis = recommendationService.analyzeBestTravelTime(weatherData);

    const analysis = {
      city,
      currentWeather: {
        temp: weatherData.main.temp,
        feelsLike: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        windSpeed: weatherData.wind.speed,
        cloudiness: weatherData.clouds.all,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon
      },
      travelScore: travelScore,
      analysis: bestTimeAnalysis,
      timestamp: new Date()
    };

    // Cache for 10 minutes
    cache.set(cacheKey, analysis);

    res.json(analysis);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: "City not found" });
    }
    next(err);
  }
};

/**
 * Compare multiple destinations
 */
exports.compareDestinations = async (req, res, next) => {
  try {
    const cities = req.query.cities ? req.query.cities.split(",") : [];
    
    if (cities.length < 2) {
      return res.status(400).json({ error: "Please provide at least 2 cities to compare" });
    }

    if (cities.length > 5) {
      return res.status(400).json({ error: "Maximum 5 cities can be compared at once" });
    }

    const comparison = await recommendationService.compareDestinations(cities);
    
    res.json({
      success: true,
      comparison,
      winner: comparison[0]
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Generate smart packing list
 */
exports.getPackingList = async (req, res, next) => {
  try {
    const { city } = req.params;
    const mode = req.query.mode || 'full';
    const tripDetails = {
      duration: parseInt(req.query.duration) || 7,
      activities: req.query.activities ? req.query.activities.split(",") : [],
      style: req.query.style || "casual"
    };

    // Fetch weather data
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    let packingList = packingService.generatePackingList(
      weatherResponse.data,
      tripDetails
    );

    // For minimal mode, significantly reduce items
    if (mode === 'minimal') {
      packingList = {
        ...packingList,
        clothing: packingList.clothing.slice(0, 3),
        weatherGear: packingList.weatherGear.slice(0, 1),
        activityGear: packingList.activityGear.slice(0, 1),
        essentials: {
          documents: packingList.essentials.documents.slice(0, 2),
          toiletries: packingList.essentials.toiletries.slice(0, 3),
          electronics: packingList.essentials.electronics.slice(0, 2),
          miscellaneous: packingList.essentials.miscellaneous.slice(0, 2)
        }
      };
    }

    res.json({
      success: true,
      city,
      tripDetails,
      packingList,
      mode
    });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: "City not found" });
    }
    next(err);
  }
};

/**
 * Generate minimal packing list (carry-on)
 */
exports.getMinimalPackingList = async (req, res, next) => {
  try {
    const { city } = req.params;
    const duration = parseInt(req.query.duration) || 3;

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    const packingList = packingService.generateMinimalList(
      weatherResponse.data,
      duration
    );

    res.json({
      success: true,
      city,
      duration,
      packingList,
      note: "Carry-on only packing list"
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get packing checklist
 */
exports.getPackingChecklist = async (req, res, next) => {
  try {
    const { city } = req.params;
    const tripDetails = {
      duration: parseInt(req.query.duration) || 7,
      activities: req.query.activities ? req.query.activities.split(",") : [],
      style: req.query.style || "casual"
    };

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    const packingList = packingService.generatePackingList(
      weatherResponse.data,
      tripDetails
    );

    const checklist = packingService.getPackingChecklist(packingList);

    res.json({
      success: true,
      city,
      checklist
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get 5-day forecast with scoring
 */
exports.getForecast = async (req, res, next) => {
  try {
    const { city } = req.params;

    // Fetch BOTH current weather and forecast for accurate real-time data
    const [weatherResponse, forecastResponse] = await Promise.all([
      axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_API_KEY}&units=metric`
      ),
      axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_API_KEY}&units=metric`
      )
    ]);

    const currentWeather = weatherResponse.data;
    const forecastData = forecastResponse.data;
    
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Process forecast data and add travel scores
    const processedForecast = forecastData.list.map(item => {
      const score = recommendationService.calculateTravelScore(item);
      return {
        date: item.dt_txt,
        temp: item.main.temp,
        description: item.weather[0].description,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        rain: item.rain ? item.rain['3h'] : 0, // Rain volume in mm for past 3 hours
        travelScore: score.rating,
        recommendation: score.recommendation
      };
    });

    // Group by day
    const dailyForecasts = {};
    processedForecast.forEach(item => {
      const day = item.date.split(" ")[0];
      if (!dailyForecasts[day]) {
        dailyForecasts[day] = [];
      }
      dailyForecasts[day].push(item);
    });

    // Calculate daily averages
    const dailySummaries = Object.keys(dailyForecasts).map(day => {
      const dayData = dailyForecasts[day];
      const avgTemp = dayData.reduce((sum, item) => sum + item.temp, 0) / dayData.length;
      const avgScore = dayData.reduce((sum, item) => sum + item.travelScore, 0) / dayData.length;
      const roundedScore = Math.round(avgScore * 10) / 10;
      
      // For today, use current weather data for more accurate conditions
      let conditions = dayData[Math.floor(dayData.length / 2)].description;
      let hourlyDataForDay = dayData;
      
      if (day === today) {
        // Override today's conditions with real-time data
        conditions = currentWeather.weather[0].description;
        // Insert current weather at the beginning for real-time accuracy
        hourlyDataForDay = [{
          date: new Date().toISOString(),
          temp: currentWeather.main.temp,
          description: currentWeather.weather[0].description,
          humidity: currentWeather.main.humidity,
          windSpeed: currentWeather.wind.speed,
          rain: 0, // Current weather doesn't have rain field, forecast does
          travelScore: recommendationService.calculateTravelScore(currentWeather).rating,
          recommendation: recommendationService.calculateTravelScore(currentWeather).recommendation
        }, ...dayData];
      }
      
      return {
        date: day,
        avgTemp: Math.round(avgTemp * 10) / 10,
        avgTravelScore: roundedScore,
        conditions: conditions,
        recommendation: recommendationService.getRecommendationText(roundedScore),
        hourlyData: hourlyDataForDay
      };
    });

    res.json({
      success: true,
      city: forecastData.city.name,
      country: forecastData.city.country,
      dailyForecasts: dailySummaries,
      bestDay: dailySummaries.reduce((best, current) =>
        current.avgTravelScore > best.avgTravelScore ? current : best
      )
    });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: "City not found" });
    }
    next(err);
  }
};

/**
 * Get nearby cities to a searched city
 */
exports.getNearestCities = async (req, res, next) => {
  try {
    const { city } = req.params;

    // Get current weather and coordinates of the searched city
    const cityWeatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    const cityData = cityWeatherResponse.data;
    const centerLat = cityData.coord.lat;
    const centerLon = cityData.coord.lon;

    // Try OpenWeather nearby search first for real nearby cities
    let nearestCities = [];
    try {
      const nearbyResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/find?lat=${centerLat}&lon=${centerLon}&cnt=30&appid=${process.env.WEATHER_API_KEY}&units=metric`
      );

      const nearbyList = nearbyResponse.data.list || [];
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
      };

      nearestCities = nearbyList
        .map(item => ({
          item,
          distance: calculateDistance(centerLat, centerLon, item.coord.lat, item.coord.lon)
        }))
        .filter(({ item, distance }) =>
          item.name.toLowerCase() !== city.toLowerCase() &&
          item.sys?.country === cityData.sys.country &&
          distance <= 100
        )
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5)
        .map(({ item, distance }) => {
          const score = recommendationService.calculateTravelScore(item);
          return {
            name: item.name,
            distance,
            weather: {
              temp: Math.round(item.main.temp),
              humidity: item.main.humidity,
              description: item.weather[0]?.description || ''
            },
            travelScore: score.rating,
            reason: `${Math.round(item.main.temp)}°C in ${item.name}, ${distance}km away`
          };
        });
    } catch (err) {
      nearestCities = [];
    }

    if (nearestCities.length > 0) {
      return res.json({
        success: true,
        city: cityData.name,
        nearestCities
      });
    }

    // List of major world cities for recommendations (curated)
    const majorCities = [
      { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
      { name: 'Manchester', country: 'GB', lat: 53.4808, lon: -2.2426 },
      { name: 'Birmingham', country: 'GB', lat: 52.4862, lon: -1.8904 },
      { name: 'Liverpool', country: 'GB', lat: 53.4084, lon: -2.9916 },
      { name: 'Glasgow', country: 'GB', lat: 55.8642, lon: -4.2518 },
      { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
      { name: 'Lyon', country: 'FR', lat: 45.7640, lon: 4.8357 },
      { name: 'Marseille', country: 'FR', lat: 43.2965, lon: 5.3698 },
      { name: 'Berlin', country: 'DE', lat: 52.5200, lon: 13.4050 },
      { name: 'Munich', country: 'DE', lat: 48.1351, lon: 11.5820 },
      { name: 'Hamburg', country: 'DE', lat: 53.5511, lon: 9.9937 },
      { name: 'Amsterdam', country: 'NL', lat: 52.3676, lon: 4.9041 },
      { name: 'Rotterdam', country: 'NL', lat: 51.9244, lon: 4.4777 },
      { name: 'Rome', country: 'IT', lat: 41.9028, lon: 12.4964 },
      { name: 'Milan', country: 'IT', lat: 45.4642, lon: 9.1900 },
      { name: 'Naples', country: 'IT', lat: 40.8518, lon: 14.2681 },
      { name: 'Barcelona', country: 'ES', lat: 41.3874, lon: 2.1686 },
      { name: 'Madrid', country: 'ES', lat: 40.4168, lon: -3.7038 },
      { name: 'Valencia', country: 'ES', lat: 39.4699, lon: -0.3763 },
      { name: 'Vienna', country: 'AT', lat: 48.2082, lon: 16.3738 },
      { name: 'Prague', country: 'CZ', lat: 50.0755, lon: 14.4378 },
      { name: 'Budapest', country: 'HU', lat: 47.4979, lon: 19.0402 },
      { name: 'Zurich', country: 'CH', lat: 47.3769, lon: 8.5472 },
      { name: 'Athens', country: 'GR', lat: 37.9838, lon: 23.7275 },
      { name: 'Istanbul', country: 'TR', lat: 41.0082, lon: 28.9784 },
      { name: 'Dubai', country: 'AE', lat: 25.2048, lon: 55.2708 },
      { name: 'Singapore', country: 'SG', lat: 1.3521, lon: 103.8198 },
      { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
      { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
      { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
      { name: 'Los Angeles', country: 'US', lat: 34.0522, lon: -118.2437 }
    ];

    // Calculate distance function (haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return Math.round(R * c);
    };

    // Prefer same-country cities first, then fill with closest neighbors
    const normalizedCity = city.toLowerCase();
    const sameCountryCities = majorCities
      .filter(c => c.country === cityData.sys.country && c.name.toLowerCase() !== normalizedCity)
      .map(c => ({
        ...c,
        distance: calculateDistance(centerLat, centerLon, c.lat, c.lon)
      }))
      .sort((a, b) => a.distance - b.distance);

    const otherCities = majorCities
      .filter(c => c.country !== cityData.sys.country && c.name.toLowerCase() !== normalizedCity)
      .map(c => ({
        ...c,
        distance: calculateDistance(centerLat, centerLon, c.lat, c.lon)
      }))
      .sort((a, b) => a.distance - b.distance);

    const nearbyWithDistance = [...sameCountryCities, ...otherCities]
      .filter(c => c.distance <= 100)
      .slice(0, 5);

    // Fetch weather for each nearby city
    const nearestCitiesWithWeather = await Promise.all(
      nearbyWithDistance.map(async (c) => {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(c.name)}&appid=${process.env.WEATHER_API_KEY}&units=metric`
          );
          const weatherData = response.data;
          const score = recommendationService.calculateTravelScore(weatherData);
          
          return {
            name: c.name,
            distance: c.distance,
            weather: {
              temp: Math.round(weatherData.main.temp),
              humidity: weatherData.main.humidity,
              description: weatherData.weather[0].description
            },
            travelScore: score.rating,
            reason: `${Math.round(weatherData.main.temp)}°C in ${c.name}, ${c.distance}km away`
          };
        } catch (err) {
          return null;
        }
      })
    );

    // Filter out any null results
    const validCities = nearestCitiesWithWeather.filter(c => c !== null);

    res.json({
      success: true,
      city: cityData.name,
      nearestCities: validCities
    });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: "City not found" });
    }
    next(err);
  }
};

module.exports = exports;
