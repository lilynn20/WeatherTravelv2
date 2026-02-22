const router = require("express").Router();
const axios = require("axios");
const cache = require("../services/cacheService");

router.get("/:city", async (req, res, next) => {
  try {
    const { city } = req.params;
    
    // Check cache first
    const cachedData = cache.get(city);
    if (cachedData) {
      return res.json({ ...cachedData, cached: true });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    // Store in cache
    cache.set(city, response.data);

    res.json(response.data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json({ 
        error: err.response.data.message || "Weather data not found" 
      });
    }
    next(err);
  }
});

module.exports = router;