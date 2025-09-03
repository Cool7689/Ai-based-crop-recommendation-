const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get real weather data
router.get('/current/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Weather API key not configured',
        message: 'Please configure WEATHER_API_KEY in environment'
      });
    }

    const response = await axios.get(
      `${process.env.WEATHER_BASE_URL}/weather`,
      {
        params: {
          q: location,
          appid: apiKey,
          units: 'metric'
        }
      }
    );

    const weatherData = {
      location: response.data.name,
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      rainfall: response.data.rain ? response.data.rain['1h'] || 0 : 0,
      windSpeed: response.data.wind.speed,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: {
        weather: weatherData
      }
    });

  } catch (error) {
    console.error('Get weather error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get weather data',
      message: error.message
    });
  }
});

// Get weather forecast
router.get('/forecast/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const { days = 5 } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Weather API key not configured',
        message: 'Please configure WEATHER_API_KEY in environment'
      });
    }

    const response = await axios.get(
      `${process.env.WEATHER_BASE_URL}/forecast`,
      {
        params: {
          q: location,
          appid: apiKey,
          units: 'metric',
          cnt: days * 8 // 8 forecasts per day
        }
      }
    );

    const forecast = response.data.list.map(item => ({
      date: new Date(item.dt * 1000).toISOString(),
      temperature: item.main.temp,
      humidity: item.main.humidity,
      rainfall: item.rain ? item.rain['3h'] || 0 : 0,
      windSpeed: item.wind.speed,
      description: item.weather[0].description,
      icon: item.weather[0].icon
    }));

    res.status(200).json({
      success: true,
      data: {
        location: response.data.city.name,
        forecast,
        count: forecast.length
      }
    });

  } catch (error) {
    console.error('Get forecast error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get weather forecast',
      message: error.message
    });
  }
});

// Get weather alerts
router.get('/alerts/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Weather API key not configured',
        message: 'Please configure WEATHER_API_KEY in environment'
      });
    }

    const response = await axios.get(
      `${process.env.WEATHER_BASE_URL}/onecall`,
      {
        params: {
          q: location,
          appid: apiKey,
          exclude: 'current,minutely,hourly,daily'
        }
      }
    );

    const alerts = response.data.alerts ? response.data.alerts.map(alert => ({
      type: alert.event,
      severity: alert.severity,
      description: alert.description,
      validFrom: new Date(alert.start * 1000).toISOString(),
      validTo: new Date(alert.end * 1000).toISOString()
    })) : [];

    res.status(200).json({
      success: true,
      data: {
        location,
        alerts,
        count: alerts.length
      }
    });

  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get weather alerts',
      message: error.message
    });
  }
});

module.exports = router;


