const router = require("express").Router();
const analyticsController = require("../controllers/analyticsController");
const rateLimiter = require("../middleware/rateLimiter");

// Apply rate limiting to all analytics routes
router.use(rateLimiter);

/**
 * AI Recommendations
 */
// GET /api/analytics/recommendations?climate=warm&activities=beach,hiking&tempMin=20&tempMax=30
router.get("/recommendations", analyticsController.getRecommendations);

/**
 * Detailed City Analysis
 */
// GET /api/analytics/city/:city?tempMin=20&tempMax=30
router.get("/city/:city", analyticsController.getDetailedAnalysis);

/**
 * Compare Destinations
 */
// GET /api/analytics/compare?cities=Paris,London,Rome
router.get("/compare", analyticsController.compareDestinations);

/**
 * Smart Packing Lists
 */
// GET /api/analytics/packing/:city?duration=7&activities=beach,hiking&style=casual
router.get("/packing/:city", analyticsController.getPackingList);

// GET /api/analytics/packing/:city/minimal?duration=3
router.get("/packing/:city/minimal", analyticsController.getMinimalPackingList);

// GET /api/analytics/packing/:city/checklist?duration=7&activities=beach
router.get("/packing/:city/checklist", analyticsController.getPackingChecklist);

/**
 * 5-Day Forecast with Scores
 */
// GET /api/analytics/forecast/:city
router.get("/forecast/:city", analyticsController.getForecast);

module.exports = router;
