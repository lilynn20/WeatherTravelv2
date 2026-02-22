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
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
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
    const tripDetails = {
      duration: parseInt(req.query.duration) || 7,
      activities: req.query.activities ? req.query.activities.split(",") : [],
      style: req.query.style || "casual"
    };

    // Fetch weather data
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    const packingList = packingService.generatePackingList(
      weatherResponse.data,
      tripDetails
    );

    res.json({
      success: true,
      city,
      tripDetails,
      packingList
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
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
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
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
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

    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    const forecastData = forecastResponse.data;
    
    // Process forecast data and add travel scores
    const processedForecast = forecastData.list.map(item => {
      const score = recommendationService.calculateTravelScore(item);
      return {
        date: item.dt_txt,
        temp: item.main.temp,
        description: item.weather[0].description,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
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
      
      return {
        date: day,
        avgTemp: Math.round(avgTemp * 10) / 10,
        avgTravelScore: Math.round(avgScore * 10) / 10,
        conditions: dayData[Math.floor(dayData.length / 2)].description,
        hourlyData: dayData
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

module.exports = exports;
