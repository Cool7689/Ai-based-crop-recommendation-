const Crop = require('../models/Crop');

// Get all crops
const getAllCrops = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, season } = req.query;
    
    let query = { isActive: true };
    
    if (category) query.category = category;
    if (season) query.season = season;
    
    const crops = await Crop.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('name category season yieldInfo.averageYield economicInfo.estimatedProfit');
    
    const total = await Crop.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: {
        crops,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalCrops: total
      }
    });
    
  } catch (error) {
    console.error('Get all crops error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get crops',
      message: error.message
    });
  }
};

// Get crop by ID
const getCropById = async (req, res) => {
  try {
    const { cropId } = req.params;
    
    const crop = await Crop.findById(cropId);
    
    if (!crop) {
      return res.status(404).json({
        success: false,
        error: 'Crop not found',
        message: 'Crop does not exist'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        crop
      }
    });
    
  } catch (error) {
    console.error('Get crop by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get crop',
      message: error.message
    });
  }
};

// Get crops by category
const getCropsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const crops = await Crop.find({ 
      category, 
      isActive: true 
    })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    const total = await Crop.countDocuments({ category, isActive: true });
    
    res.status(200).json({
      success: true,
      data: {
        crops,
        category,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalCrops: total
      }
    });
    
  } catch (error) {
    console.error('Get crops by category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get crops by category',
      message: error.message
    });
  }
};

// Get crops by season
const getCropsBySeason = async (req, res) => {
  try {
    const { season } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const crops = await Crop.find({ 
      season, 
      isActive: true 
    })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    const total = await Crop.countDocuments({ season, isActive: true });
    
    res.status(200).json({
      success: true,
      data: {
        crops,
        season,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalCrops: total
      }
    });
    
  } catch (error) {
    console.error('Get crops by season error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get crops by season',
      message: error.message
    });
  }
};

// Get crops by soil type
const getCropsBySoilType = async (req, res) => {
  try {
    const { soilType } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const crops = await Crop.find({ 
      'growthRequirements.soilType': soilType, 
      isActive: true 
    })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    const total = await Crop.countDocuments({ 
      'growthRequirements.soilType': soilType, 
      isActive: true 
    });
    
    res.status(200).json({
      success: true,
      data: {
        crops,
        soilType,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalCrops: total
      }
    });
    
  } catch (error) {
    console.error('Get crops by soil type error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get crops by soil type',
      message: error.message
    });
  }
};

// Get crops by region
const getCropsByRegion = async (req, res) => {
  try {
    const { state } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const crops = await Crop.find({ 
      'regionalSuitability.states': state, 
      isActive: true 
    })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    const total = await Crop.countDocuments({ 
      'regionalSuitability.states': state, 
      isActive: true 
    });
    
    res.status(200).json({
      success: true,
      data: {
        crops,
        state,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalCrops: total
      }
    });
    
  } catch (error) {
    console.error('Get crops by region error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get crops by region',
      message: error.message
    });
  }
};

// Search crops
const searchCrops = async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const searchRegex = new RegExp(query, 'i');
    
    const crops = await Crop.find({
      $or: [
        { name: searchRegex },
        { scientificName: searchRegex },
        { 'localNames.hindi': searchRegex },
        { 'localNames.telugu': searchRegex },
        { 'localNames.tamil': searchRegex }
      ],
      isActive: true
    })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    const total = await Crop.countDocuments({
      $or: [
        { name: searchRegex },
        { scientificName: searchRegex },
        { 'localNames.hindi': searchRegex },
        { 'localNames.telugu': searchRegex },
        { 'localNames.tamil': searchRegex }
      ],
      isActive: true
    });
    
    res.status(200).json({
      success: true,
      data: {
        crops,
        query,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalCrops: total
      }
    });
    
  } catch (error) {
    console.error('Search crops error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search crops',
      message: error.message
    });
  }
};

// Filter crops
const filterCrops = async (req, res) => {
  try {
    const { category, season, soilType, minYield, maxYield, minProfit, maxProfit } = req.body;
    const { page = 1, limit = 20 } = req.query;
    
    let query = { isActive: true };
    
    if (category) query.category = category;
    if (season) query.season = season;
    if (soilType) query['growthRequirements.soilType'] = soilType;
    if (minYield) query['yieldInfo.averageYield'] = { $gte: minYield };
    if (maxYield) query['yieldInfo.averageYield'] = { ...query['yieldInfo.averageYield'], $lte: maxYield };
    if (minProfit) query['economicInfo.estimatedProfit'] = { $gte: minProfit };
    if (maxProfit) query['economicInfo.estimatedProfit'] = { ...query['economicInfo.estimatedProfit'], $lte: maxProfit };
    
    const crops = await Crop.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Crop.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: {
        crops,
        filters: req.body,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalCrops: total
      }
    });
    
  } catch (error) {
    console.error('Filter crops error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to filter crops',
      message: error.message
    });
  }
};

// Get quick recommendations
const getQuickRecommendations = async (req, res) => {
  try {
    const { soilType, season, region } = req.query;
    
    let query = { isActive: true };
    
    if (soilType) query['growthRequirements.soilType'] = soilType;
    if (season) query.season = season;
    if (region) query['regionalSuitability.states'] = region;
    
    const crops = await Crop.find(query)
      .sort({ 'economicInfo.estimatedProfit': -1 })
      .limit(5)
      .select('name category season yieldInfo.averageYield economicInfo.estimatedProfit');
    
    res.status(200).json({
      success: true,
      data: {
        recommendations: crops,
        filters: { soilType, season, region }
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
};

// Placeholder functions for other routes
const getCropDetails = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Crop details endpoint - to be implemented in Phase 2'
  });
};

const getCultivationGuide = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cultivation guide endpoint - to be implemented in Phase 2'
  });
};

const getMarketAnalysis = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Market analysis endpoint - to be implemented in Phase 2'
  });
};

const getRiskAssessment = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Risk assessment endpoint - to be implemented in Phase 2'
  });
};

const compareCrops = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Crop comparison endpoint - to be implemented in Phase 2'
  });
};

const getComparisonResult = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Comparison result endpoint - to be implemented in Phase 2'
  });
};

module.exports = {
  getAllCrops,
  getCropById,
  getCropsByCategory,
  getCropsBySeason,
  getCropsBySoilType,
  getCropsByRegion,
  searchCrops,
  filterCrops,
  getQuickRecommendations,
  getCropDetails,
  getCultivationGuide,
  getMarketAnalysis,
  getRiskAssessment,
  compareCrops,
  getComparisonResult
};
