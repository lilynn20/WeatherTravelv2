const axios = require("axios");
const cache = require("../services/cacheService");

const OWM_BASE = "https://api.openweathermap.org";

const getKey = () => process.env.WEATHER_API_KEY;

// GET /api/weather/alerts/:city — fetch weather alerts for a city
exports.getAlerts = async (req, res, next) => {
  try {
    const { city } = req.params;
    const { units = "metric", lang = "en" } = req.query;

    const cacheKey = `alerts_${city}_${units}_${lang}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ ...cached, cached: true });

    // First get coordinates via geo API
    const geoRes = await axios.get(`${OWM_BASE}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${getKey()}`);
    if (!geoRes.data || geoRes.data.length === 0) {
      return res.status(404).json({ error: "City not found" });
    }
    const { lat, lon } = geoRes.data[0];

    // One-call API for alerts (requires subscription on free tier — gracefully degrade)
    let alerts = [];
    try {
      const oneCallRes = await axios.get(
        `${OWM_BASE}/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${getKey()}&units=${units}&lang=${lang}`
      );
      alerts = oneCallRes.data.alerts || [];
    } catch {
      // One Call 3.0 may not be subscribed; return empty alerts rather than error
      alerts = [];
    }

    const result = { city, lat, lon, alerts };
    cache.set(cacheKey, result, 1800); // 30 min TTL for alerts
    res.json(result);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: err.response.data.message });
    next(err);
  }
};

// GET /api/weather/compare?cities=Paris,London,Rome — compare multiple cities
exports.compareWeather = async (req, res, next) => {
  try {
    const { cities, units = "metric", lang = "en" } = req.query;
    if (!cities) return res.status(400).json({ error: "cities query param required" });

    const cityList = cities.split(",").map((c) => c.trim()).filter(Boolean).slice(0, 6);
    if (cityList.length < 2) return res.status(400).json({ error: "At least 2 cities required for comparison" });

    const results = await Promise.allSettled(
      cityList.map((city) =>
        axios.get(`${OWM_BASE}/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${getKey()}&units=${units}&lang=${lang}`)
          .then((r) => r.data)
      )
    );

    const data = results
      .map((r, i) => (r.status === "fulfilled" ? r.value : { error: true, city: cityList[i] }))
      .filter((d) => !d.error);

    res.json({ cities: data, units });
  } catch (err) {
    next(err);
  }
};

// GET /api/weather/:city — fetch weather by city name
exports.getWeatherByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    const { units = "metric", lang = "en" } = req.query;

    const cacheKey = `city_${city}_${units}_${lang}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ ...cached, cached: true });

    const response = await axios.get(
      `${OWM_BASE}/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${getKey()}&units=${units}&lang=${lang}`
    );

    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: err.response.data.message || "Weather not found" });
    next(err);
  }
};

// GET /api/weather?lat=&lon= — fetch weather by coordinates
exports.getWeatherByCoords = async (req, res, next) => {
  try {
    const { lat, lon, units = "metric", lang = "en" } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: "lat and lon required" });

    const cacheKey = `coords_${lat}_${lon}_${units}_${lang}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ ...cached, cached: true });

    const response = await axios.get(
      `${OWM_BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${getKey()}&units=${units}&lang=${lang}`
    );

    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: err.response.data.message || "Weather not found" });
    next(err);
  }
};

// GET /api/weather/forecast/:city — fetch forecast by city name
exports.getForecastByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    const { units = "metric", lang = "en" } = req.query;

    const cacheKey = `forecast_${city}_${units}_${lang}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ ...cached, cached: true });

    const response = await axios.get(
      `${OWM_BASE}/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${getKey()}&units=${units}&lang=${lang}`
    );

    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json({ error: err.response.data.message || "Forecast not found" });
    next(err);
  }
};
