const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get real market data
router.get('/prices/:crop', async (req, res) => {
  try {
    const { crop } = req.params;
    const { location } = req.query;
    const apiKey = process.env.MARKET_API_KEY;
    
    if (!apiKey) {
      // Return mock data if API key not configured
      const mockPrices = {
        crop,
        location: location || 'National',
        currentPrice: 2500 + Math.random() * 500,
        minPrice: 2200,
        maxPrice: 2800,
        unit: '₹/quintal',
        trend: ['increasing', 'stable', 'decreasing'][Math.floor(Math.random() * 3)],
        lastUpdated: new Date().toISOString()
      };

      return res.status(200).json({
        success: true,
        data: {
          prices: mockPrices,
          note: 'Using mock data - configure MARKET_API_KEY for real data'
        }
      });
    }

    // Real API call would go here
    const response = await axios.get(
      `${process.env.MARKET_BASE_URL}/prices/${crop}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        params: {
          location: location || 'national'
        }
      }
    );

    res.status(200).json({
      success: true,
      data: {
        prices: response.data
      }
    });

  } catch (error) {
    console.error('Get market prices error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get market prices',
      message: error.message
    });
  }
});

// Get market trends
router.get('/trends/:crop', async (req, res) => {
  try {
    const { crop } = req.params;
    const { period = 'monthly' } = req.query;
    const apiKey = process.env.MARKET_API_KEY;
    
    if (!apiKey) {
      // Return mock trends if API key not configured
      const mockTrends = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
        price: 2000 + (i * 100) + (Math.random() * 200),
        volume: 1000 + (Math.random() * 500),
        trend: Math.random() > 0.5 ? 'up' : 'down'
      }));

      return res.status(200).json({
        success: true,
        data: {
          crop,
          period,
          trends: mockTrends,
          note: 'Using mock data - configure MARKET_API_KEY for real data'
        }
      });
    }

    // Real API call would go here
    const response = await axios.get(
      `${process.env.MARKET_BASE_URL}/trends/${crop}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        params: { period }
      }
    );

    res.status(200).json({
      success: true,
      data: {
        trends: response.data
      }
    });

  } catch (error) {
    console.error('Get market trends error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get market trends',
      message: error.message
    });
  }
});

// Get market insights
router.get('/insights', async (req, res) => {
  try {
    const apiKey = process.env.MARKET_API_KEY;
    
    if (!apiKey) {
      // Return mock insights if API key not configured
      const mockInsights = {
        topPerformingCrops: ['Rice', 'Wheat', 'Cotton'],
        marketTrends: {
          rice: 'Strong demand in export markets',
          wheat: 'Stable domestic consumption',
          cotton: 'Decreasing due to global factors'
        },
        recommendations: [
          'Consider rice cultivation for export markets',
          'Wheat prices expected to remain stable',
          'Monitor cotton market conditions'
        ],
        note: 'Using mock data - configure MARKET_API_KEY for real data'
      };

      return res.status(200).json({
        success: true,
        data: {
          insights: mockInsights
        }
      });
    }

    // Real API call would go here
    const response = await axios.get(
      `${process.env.MARKET_BASE_URL}/insights`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    res.status(200).json({
      success: true,
      data: {
        insights: response.data
      }
    });

  } catch (error) {
    console.error('Get market insights error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get market insights',
      message: error.message
    });
  }
});

module.exports = router;


