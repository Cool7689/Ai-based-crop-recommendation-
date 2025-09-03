const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get comprehensive recommendations
router.post('/generate', async (req, res) => {
  try {
    const { farmerData, context } = req.body;

    if (!farmerData || !context) {
      return res.status(400).json({
        success: false,
        error: 'Missing required data',
        message: 'Farmer data and context are required'
      });
    }

    // Get weather data
    let weatherData = null;
    try {
      const weatherResponse = await axios.get(
        `http://localhost:${process.env.PORT || 5001}/api/weather/current/${farmerData.location.district}`
      );
      weatherData = weatherResponse.data.data.weather;
    } catch (error) {
      console.log('Weather data not available, using default');
    }

    // Get market data
    let marketData = null;
    try {
      const marketResponse = await axios.get(
        `http://localhost:${process.env.PORT || 5001}/api/market/insights`
      );
      marketData = marketResponse.data.data.insights;
    } catch (error) {
      console.log('Market data not available, using default');
    }

    // Generate AI recommendation
    const aiResponse = await axios.post(
      `http://localhost:${process.env.PORT || 5001}/api/ai/recommend`,
      {
        context,
        farmerData,
        weatherData,
        marketData
      }
    );

    const recommendation = aiResponse.data.data.recommendation;

    res.status(200).json({
      success: true,
      message: 'Recommendation generated successfully',
      data: {
        recommendation,
        weatherData,
        marketData,
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

// Get quick recommendations
router.get('/quick', async (req, res) => {
  try {
    const { soilType, season, region } = req.query;

    if (!soilType || !season || !region) {
      return res.status(400).json({
        success: false,
        error: 'Missing parameters',
        message: 'Soil type, season, and region are required'
      });
    }

    // Mock quick recommendations based on parameters
    const quickRecommendations = {
      rice: {
        cropName: 'Rice',
        confidence: 0.85,
        reasoning: `Rice is highly suitable for ${soilType} soil in ${season} season in ${region}`,
        estimatedYield: 2500,
        estimatedProfit: 45000
      },
      wheat: {
        cropName: 'Wheat',
        confidence: 0.75,
        reasoning: `Wheat performs well in ${soilType} soil during ${season}`,
        estimatedYield: 3200,
        estimatedProfit: 52000
      },
      cotton: {
        cropName: 'Cotton',
        confidence: 0.65,
        reasoning: `Cotton can be cultivated in ${region} with proper irrigation`,
        estimatedYield: 1800,
        estimatedProfit: 38000
      }
    };

    res.status(200).json({
      success: true,
      data: {
        recommendations: Object.values(quickRecommendations),
        filters: { soilType, season, region },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get quick recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get quick recommendations',
      message: error.message
    });
  }
});

module.exports = router;


