const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const authMiddleware = require('../middleware/auth');

// Market data routes
router.get('/prices/:crop', marketController.getCropPrices);
router.get('/prices', marketController.getAllPrices);
router.get('/trends/:crop', marketController.getPriceTrends);
router.get('/demand/:crop', marketController.getDemandAnalysis);

// Market insights
router.get('/insights', marketController.getMarketInsights);
router.get('/forecast/:crop', marketController.getPriceForecast);
router.get('/opportunities', marketController.getMarketOpportunities);

// Location-based market data
router.get('/prices/:location/:crop', marketController.getLocalPrices);
router.get('/markets/:location', marketController.getNearbyMarkets);
router.get('/transport-costs/:from/:to', marketController.getTransportCosts);

// Market recommendations
router.post('/sell-recommendations', authMiddleware, marketController.getSellRecommendations);
router.get('/buy-recommendations', authMiddleware, marketController.getBuyRecommendations);
router.get('/storage-recommendations', authMiddleware, marketController.getStorageRecommendations);

module.exports = router;
