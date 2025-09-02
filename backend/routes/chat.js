const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

// Chat session routes
router.post('/session', authMiddleware, chatController.createSession);
router.get('/session/:sessionId', authMiddleware, chatController.getSession);
router.get('/sessions', authMiddleware, chatController.getUserSessions);
router.put('/session/:sessionId/end', authMiddleware, chatController.endSession);

// Message routes
router.post('/message', authMiddleware, chatController.sendMessage);
router.get('/session/:sessionId/messages', authMiddleware, chatController.getMessages);

// AI recommendation routes
router.post('/recommend', authMiddleware, chatController.getRecommendation);
router.get('/session/:sessionId/recommendations', authMiddleware, chatController.getSessionRecommendations);

// Voice routes
router.post('/voice', authMiddleware, chatController.handleVoiceMessage);
router.get('/voice/:messageId', authMiddleware, chatController.getVoiceResponse);

module.exports = router;
