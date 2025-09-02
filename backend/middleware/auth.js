const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'Access denied. No token provided.',
        message: 'Please login to access this resource'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find farmer by id
    const farmer = await Farmer.findById(decoded.farmerId).select('-password');
    
    if (!farmer) {
      return res.status(401).json({
        error: 'Invalid token.',
        message: 'User not found'
      });
    }

    if (!farmer.isActive) {
      return res.status(401).json({
        error: 'Account deactivated.',
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Add farmer to request object
    req.farmer = farmer;
    next();
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token.',
        message: 'Please login again'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired.',
        message: 'Your session has expired. Please login again'
      });
    }
    
    res.status(500).json({
      error: 'Server error.',
      message: 'Something went wrong with authentication'
    });
  }
};

// Optional auth middleware (for routes that can work with or without auth)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const farmer = await Farmer.findById(decoded.farmerId).select('-password');
      
      if (farmer && farmer.isActive) {
        req.farmer = farmer;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.farmer) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please login to access this resource'
      });
    }

    if (!roles.includes(req.farmer.subscriptionType)) {
      return res.status(403).json({
        error: 'Access denied',
        message: `This feature requires ${roles.join(' or ')} subscription`
      });
    }

    next();
  };
};

module.exports = {
  auth,
  optionalAuth,
  authorize
};
