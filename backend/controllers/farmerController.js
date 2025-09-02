const Farmer = require('../models/Farmer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new farmer
const registerFarmer = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      location,
      farmDetails,
      preferredLanguage
    } = req.body;

    // Check if farmer already exists
    const existingFarmer = await Farmer.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingFarmer) {
      return res.status(400).json({
        success: false,
        error: 'Farmer already exists',
        message: 'A farmer with this email or phone number already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new farmer
    const farmer = new Farmer({
      name,
      phone,
      email,
      password: hashedPassword,
      location,
      farmDetails,
      preferredLanguage: preferredLanguage || 'English'
    });

    await farmer.save();

    // Generate JWT token
    const token = jwt.sign(
      { farmerId: farmer._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Remove password from response
    const farmerResponse = farmer.toObject();
    delete farmerResponse.password;

    res.status(201).json({
      success: true,
      message: 'Farmer registered successfully',
      data: {
        farmer: farmerResponse,
        token
      }
    });

  } catch (error) {
    console.error('Register farmer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register farmer',
      message: error.message
    });
  }
};

// Login farmer
const loginFarmer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find farmer by email
    const farmer = await Farmer.findOne({ email });

    if (!farmer) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check if account is active
    if (!farmer.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account deactivated',
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, farmer.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { farmerId: farmer._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Remove password from response
    const farmerResponse = farmer.toObject();
    delete farmerResponse.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        farmer: farmerResponse,
        token
      }
    });

  } catch (error) {
    console.error('Login farmer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login',
      message: error.message
    });
  }
};

// Get farmer profile
const getProfile = async (req, res) => {
  try {
    const farmerId = req.farmer._id;

    const farmer = await Farmer.findById(farmerId).select('-password');

    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: 'Farmer not found',
        message: 'Farmer profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        farmer,
        farmSummary: farmer.getFarmSummary()
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile',
      message: error.message
    });
  }
};

// Update farmer profile
const updateProfile = async (req, res) => {
  try {
    const farmerId = req.farmer._id;
    const { name, phone, email, preferredLanguage } = req.body;

    const farmer = await Farmer.findById(farmerId);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: 'Farmer not found',
        message: 'Farmer profile not found'
      });
    }

    // Check if email or phone is already taken by another farmer
    if (email && email !== farmer.email) {
      const existingFarmer = await Farmer.findOne({ email, _id: { $ne: farmerId } });
      if (existingFarmer) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists',
          message: 'This email is already registered by another farmer'
        });
      }
    }

    if (phone && phone !== farmer.phone) {
      const existingFarmer = await Farmer.findOne({ phone, _id: { $ne: farmerId } });
      if (existingFarmer) {
        return res.status(400).json({
          success: false,
          error: 'Phone already exists',
          message: 'This phone number is already registered by another farmer'
        });
      }
    }

    // Update fields
    if (name) farmer.name = name;
    if (phone) farmer.phone = phone;
    if (email) farmer.email = email;
    if (preferredLanguage) farmer.preferredLanguage = preferredLanguage;

    await farmer.save();

    // Remove password from response
    const farmerResponse = farmer.toObject();
    delete farmerResponse.password;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        farmer: farmerResponse
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      message: error.message
    });
  }
};

// Update farm details
const updateFarmDetails = async (req, res) => {
  try {
    const farmerId = req.farmer._id;
    const { totalLandArea, irrigatedArea, soilType, soilPh } = req.body;

    const farmer = await Farmer.findById(farmerId);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: 'Farmer not found',
        message: 'Farmer profile not found'
      });
    }

    // Update farm details
    if (totalLandArea !== undefined) farmer.farmDetails.totalLandArea = totalLandArea;
    if (irrigatedArea !== undefined) farmer.farmDetails.irrigatedArea = irrigatedArea;
    if (soilType) farmer.farmDetails.soilType = soilType;
    if (soilPh !== undefined) farmer.farmDetails.soilPh = soilPh;

    await farmer.save();

    res.status(200).json({
      success: true,
      message: 'Farm details updated successfully',
      data: {
        farmDetails: farmer.farmDetails,
        farmSummary: farmer.getFarmSummary()
      }
    });

  } catch (error) {
    console.error('Update farm details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update farm details',
      message: error.message
    });
  }
};

// Update preferences
const updatePreferences = async (req, res) => {
  try {
    const farmerId = req.farmer._id;
    const { preferredLanguage } = req.body;

    const farmer = await Farmer.findById(farmerId);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: 'Farmer not found',
        message: 'Farmer profile not found'
      });
    }

    // Update preferences
    if (preferredLanguage) farmer.preferredLanguage = preferredLanguage;

    await farmer.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferredLanguage: farmer.preferredLanguage
      }
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences',
      message: error.message
    });
  }
};

// Get farmer analytics
const getAnalytics = async (req, res) => {
  try {
    const farmerId = req.farmer._id;

    // TODO: Implement analytics logic
    // For now, return mock analytics
    const mockAnalytics = {
      totalSessions: 15,
      totalRecommendations: 23,
      averageSessionDuration: 25, // minutes
      mostRecommendedCrop: 'Rice',
      successRate: 0.85,
      monthlyTrends: [
        { month: 'Jan', sessions: 5, recommendations: 8 },
        { month: 'Feb', sessions: 7, recommendations: 12 },
        { month: 'Mar', sessions: 3, recommendations: 3 }
      ]
    };

    res.status(200).json({
      success: true,
      data: {
        analytics: mockAnalytics
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get analytics',
      message: error.message
    });
  }
};

// Get recommendations history
const getRecommendationsHistory = async (req, res) => {
  try {
    const farmerId = req.farmer._id;
    const { page = 1, limit = 10 } = req.query;

    // TODO: Implement recommendations history
    // For now, return mock data
    const mockHistory = [
      {
        id: 1,
        cropName: 'Rice',
        confidence: 0.85,
        date: new Date('2024-01-15'),
        status: 'implemented'
      },
      {
        id: 2,
        cropName: 'Wheat',
        confidence: 0.78,
        date: new Date('2024-02-01'),
        status: 'considered'
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        history: mockHistory,
        totalPages: 1,
        currentPage: page,
        totalRecommendations: mockHistory.length
      }
    });

  } catch (error) {
    console.error('Get recommendations history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get recommendations history',
      message: error.message
    });
  }
};

// Get nearby farmers
const getNearbyFarmers = async (req, res) => {
  try {
    const farmerId = req.farmer._id;
    const { radius = 10 } = req.query; // radius in km

    const currentFarmer = await Farmer.findById(farmerId);

    if (!currentFarmer) {
      return res.status(404).json({
        success: false,
        error: 'Farmer not found',
        message: 'Farmer profile not found'
      });
    }

    // TODO: Implement geospatial query for nearby farmers
    // For now, return mock data
    const mockNearbyFarmers = [
      {
        id: 'farmer1',
        name: 'Rajesh Kumar',
        distance: 2.5,
        location: 'Village A, District X',
        crops: ['Rice', 'Wheat']
      },
      {
        id: 'farmer2',
        name: 'Sita Devi',
        distance: 5.1,
        location: 'Village B, District X',
        crops: ['Cotton', 'Sugarcane']
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        nearbyFarmers: mockNearbyFarmers,
        totalFarmers: mockNearbyFarmers.length,
        searchRadius: radius
      }
    });

  } catch (error) {
    console.error('Get nearby farmers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get nearby farmers',
      message: error.message
    });
  }
};

// Get regional insights
const getRegionalInsights = async (req, res) => {
  try {
    const farmerId = req.farmer._id;

    const farmer = await Farmer.findById(farmerId);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: 'Farmer not found',
        message: 'Farmer profile not found'
      });
    }

    // TODO: Implement regional insights logic
    // For now, return mock data
    const mockInsights = {
      region: farmer.location.state,
      district: farmer.location.district,
      popularCrops: ['Rice', 'Wheat', 'Cotton'],
      averageYield: {
        rice: 2800,
        wheat: 3200,
        cotton: 1800
      },
      marketTrends: {
        rice: 'increasing',
        wheat: 'stable',
        cotton: 'decreasing'
      },
      weatherForecast: {
        temperature: '25-30°C',
        rainfall: 'Moderate',
        humidity: '65%'
      }
    };

    res.status(200).json({
      success: true,
      data: {
        insights: mockInsights
      }
    });

  } catch (error) {
    console.error('Get regional insights error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get regional insights',
      message: error.message
    });
  }
};

module.exports = {
  registerFarmer,
  loginFarmer,
  getProfile,
  updateProfile,
  updateFarmDetails,
  updatePreferences,
  getAnalytics,
  getRecommendationsHistory,
  getNearbyFarmers,
  getRegionalInsights
};
