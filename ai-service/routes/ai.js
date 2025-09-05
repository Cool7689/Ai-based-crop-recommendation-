const express = require('express');
const router = express.Router();
const AIService = require('../services/aiService');

const aiService = new AIService();

// Get AI service status
router.get('/status', (req, res) => {
  try {
    const stats = aiService.getStats();
    res.status(200).json({
      success: true,
      data: {
        status: 'operational',
        stats,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get AI status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get AI status',
      message: error.message
    });
  }
});

// Generate crop recommendation
router.post('/recommend', async (req, res) => {
  try {
    const { context, farmerData, weatherData, marketData } = req.body;

    if (!context || !farmerData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required data',
        message: 'Context and farmer data are required'
      });
    }

    const recommendation = await aiService.generateRecommendation(
      context,
      farmerData,
      weatherData,
      marketData
    );

    res.status(200).json({
      success: true,
      message: 'Recommendation generated successfully',
      data: {
        recommendation,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Generate recommendation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendation',
      message: error.message
    });
  }
});

// Chat response
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionContext, language } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Missing message',
        message: 'Message is required'
      });
    }

    const response = await aiService.chatResponse(message, sessionContext || {}, language || 'English');

    res.status(200).json({
      success: true,
      message: 'Chat response generated successfully',
      data: {
        response,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Chat response error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate chat response',
      message: error.message
    });
  }
});

// Add to knowledge base
router.post('/knowledge', async (req, res) => {
  try {
    const { content, metadata } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Missing content',
        message: 'Content is required'
      });
    }

    const document = await aiService.addToKnowledgeBase(content, metadata || {});

    res.status(201).json({
      success: true,
      message: 'Document added to knowledge base successfully',
      data: {
        document,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Add to knowledge base error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add to knowledge base',
      message: error.message
    });
  }
});

// Search knowledge base
router.post('/search', async (req, res) => {
  try {
    const { query, limit } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Missing query',
        message: 'Query is required'
      });
    }

    const results = await aiService.findSimilarDocuments(query, limit || 5);

    res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: {
        results,
        query,
        count: results.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Search knowledge base error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search knowledge base',
      message: error.message
    });
  }
});

module.exports = router;


