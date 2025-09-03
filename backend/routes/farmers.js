const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const { auth: authMiddleware } = require('../middleware/auth');

// Public routes (registration and login)
router.post('/register', farmerController.registerFarmer);
router.post('/login', farmerController.loginFarmer);

// Protected routes (require authentication)
router.get('/profile', authMiddleware, farmerController.getProfile);
router.put('/profile', authMiddleware, farmerController.updateProfile);
router.put('/farm-details', authMiddleware, farmerController.updateFarmDetails);
router.put('/preferences', authMiddleware, farmerController.updatePreferences);

// Analytics and insights
router.get('/analytics', authMiddleware, farmerController.getAnalytics);
router.get('/recommendations-history', authMiddleware, farmerController.getRecommendationsHistory);

// Location-based features
router.get('/nearby-farmers', authMiddleware, farmerController.getNearbyFarmers);
router.get('/regional-insights', authMiddleware, farmerController.getRegionalInsights);

module.exports = router;
