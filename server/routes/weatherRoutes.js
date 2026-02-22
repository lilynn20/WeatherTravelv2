const router = require("express").Router();
const axios = require("axios");
const cache = require("../services/cacheService");

const normalizeName = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

router.get("/", async (req, res, next) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const cacheKey = `coords_${lat}_${lon}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({ ...cachedData, cached: true });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    cache.set(cacheKey, response.data);

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

router.get("/:city", async (req, res, next) => {
  try {
    const { city } = req.params;
    
    // Check cache first
    const cachedData = cache.get(city);
    if (cachedData) {
      return res.json({ ...cachedData, cached: true });
    }

    let response;
    try {
      response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_API_KEY}&units=metric`
      );
    } catch (err) {
      // Fallback: try geocoding or fuzzy search for small/ambiguous city names
      if (err.response && err.response.status === 404) {
        const geoResponse = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${process.env.WEATHER_API_KEY}`
        );
        const geoResults = geoResponse.data || [];
        const normalizedQuery = normalizeName(city);
        const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

        const scoreCandidate = (value) => {
          if (!value) return 0;
          const normalized = normalizeName(value);
          if (normalized === normalizedQuery) return 3;
          if (queryTokens.length > 0 && queryTokens.every(token => normalized.includes(token))) return 2;
          if (normalized.includes(normalizedQuery)) return 1;
          return 0;
        };

        let chosen = null;
        let bestScore = -1;

        geoResults.forEach((result) => {
          const localNames = result.local_names ? Object.values(result.local_names) : [];
          const candidates = [result.name, ...localNames];
          const score = Math.max(...candidates.map(scoreCandidate));
          if (score > bestScore) {
            bestScore = score;
            chosen = result;
          }
        });

        if (chosen && bestScore > 0) {
          const { lat, lon } = chosen;
          response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
          );
        } else {
          const findResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/find?q=${encodeURIComponent(city)}&type=like&sort=population&cnt=5&appid=${process.env.WEATHER_API_KEY}&units=metric`
          );
          const findList = findResponse.data?.list || [];
          if (findList.length === 0) {
            return res.status(404).json({ error: "City not found" });
          }

          const bestFind = findList.find(item => scoreCandidate(item.name) >= 2) || findList[0];
          const { lat, lon } = bestFind.coord;
          response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
          );
        }
      } else {
        throw err;
      }
    }

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