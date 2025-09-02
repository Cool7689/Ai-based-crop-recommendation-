const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');

// Public routes (no authentication required)
router.get('/', cropController.getAllCrops);
router.get('/:cropId', cropController.getCropById);
router.get('/category/:category', cropController.getCropsByCategory);
router.get('/season/:season', cropController.getCropsBySeason);
router.get('/soil/:soilType', cropController.getCropsBySoilType);
router.get('/region/:state', cropController.getCropsByRegion);

// Search and filter routes
router.get('/search/:query', cropController.searchCrops);
router.post('/filter', cropController.filterCrops);
router.get('/recommendations/quick', cropController.getQuickRecommendations);

// Detailed analysis routes
router.get('/:cropId/details', cropController.getCropDetails);
router.get('/:cropId/cultivation-guide', cropController.getCultivationGuide);
router.get('/:cropId/market-analysis', cropController.getMarketAnalysis);
router.get('/:cropId/risk-assessment', cropController.getRiskAssessment);

// Comparison routes
router.post('/compare', cropController.compareCrops);
router.get('/comparison/:comparisonId', cropController.getComparisonResult);

module.exports = router;
