const router = require("express").Router();
const weatherController = require("../controllers/weatherController");

// Weather compare endpoint
router.get("/compare", weatherController.compareWeather);

// Weather alerts endpoint
router.get("/alerts/:city", weatherController.getAlerts);

// Weather by coordinates
router.get("/", weatherController.getWeatherByCoords);

// Weather forecast by city
router.get("/forecast/:city", weatherController.getForecastByCity);

// Weather by city name
router.get("/:city", weatherController.getWeatherByCity);

module.exports = router;