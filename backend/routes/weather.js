const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const { auth: authMiddleware } = require('../middleware/auth');

// Weather data routes
router.get('/current/:location', weatherController.getCurrentWeather);
router.get('/forecast/:location', weatherController.getWeatherForecast);
router.get('/historical/:location', weatherController.getHistoricalWeather);
router.get('/alerts/:location', weatherController.getWeatherAlerts);

// Weather-based recommendations
router.post('/crop-suitability', authMiddleware, weatherController.getCropSuitability);
router.get('/irrigation-schedule', authMiddleware, weatherController.getIrrigationSchedule);
router.get('/pest-risk-assessment', authMiddleware, weatherController.getPestRiskAssessment);

// Weather analytics
router.get('/trends/:location', weatherController.getWeatherTrends);
router.get('/seasonal-analysis/:location', weatherController.getSeasonalAnalysis);

module.exports = router;
