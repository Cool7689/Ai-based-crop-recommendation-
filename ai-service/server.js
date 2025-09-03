const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.BACKEND_URL],
  credentials: true
}));

// Middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'AI Service is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    services: {
      openai: 'Ready',
      rag: 'Ready',
      weather: 'Ready',
      market: 'Ready'
    }
  });
});

// AI Routes
app.use('/api/ai', require('./routes/ai'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/market', require('./routes/market'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('AI Service Error:', err.stack);
  res.status(500).json({
    error: 'AI Service Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🤖 AI Service running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Connected to Backend: ${process.env.BACKEND_URL}`);
});

module.exports = app;


