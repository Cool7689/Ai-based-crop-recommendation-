const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true,
    unique: true
  },
  
  scientificName: {
    type: String,
    trim: true
  },
  
  localNames: {
    hindi: String,
    telugu: String,
    tamil: String,
    kannada: String,
    malayalam: String,
    bengali: String,
    marathi: String
  },
  
  // Crop Classification
  category: {
    type: String,
    required: true,
    enum: ['Cereals', 'Pulses', 'Oilseeds', 'Vegetables', 'Fruits', 'Spices', 'Fibre', 'Sugarcane', 'Commercial']
  },
  
  season: {
    type: [String],
    required: true,
    enum: ['Kharif', 'Rabi', 'Zaid', 'Summer', 'Winter', 'Monsoon']
  },
  
  // Growth Requirements
  growthRequirements: {
    soilType: {
      type: [String],
      required: true,
      enum: ['Clay', 'Sandy', 'Loamy', 'Red', 'Black', 'Alluvial', 'Laterite']
    },
    
    soilPh: {
      min: {
        type: Number,
        required: true,
        min: 0,
        max: 14
      },
      max: {
        type: Number,
        required: true,
        min: 0,
        max: 14
      }
    },
    
    temperature: {
      min: {
        type: Number,
        required: true
      },
      max: {
        type: Number,
        required: true
      },
      optimal: {
        type: Number,
        required: true
      }
    },
    
    rainfall: {
      min: {
        type: Number,
        required: true
      },
      max: {
        type: Number,
        required: true
      },
      optimal: {
        type: Number,
        required: true
      }
    },
    
    humidity: {
      min: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      },
      max: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      }
    }
  },
  
  // Growth Timeline
  growthTimeline: {
    sowingToHarvest: {
      type: Number, // in days
      required: true
    },
    vegetativeStage: {
      type: Number, // in days
      required: true
    },
    floweringStage: {
      type: Number, // in days
      required: true
    },
    fruitingStage: {
      type: Number, // in days
      required: true
    }
  },
  
  // Yield Information
  yieldInfo: {
    averageYield: {
      type: Number, // kg per acre
      required: true
    },
    minYield: {
      type: Number,
      required: true
    },
    maxYield: {
      type: Number,
      required: true
    },
    yieldUnit: {
      type: String,
      default: 'kg/acre'
    }
  },
  
  // Economic Information
  economicInfo: {
    averagePrice: {
      type: Number, // per kg
      required: true
    },
    minPrice: {
      type: Number,
      required: true
    },
    maxPrice: {
      type: Number,
      required: true
    },
    priceUnit: {
      type: String,
      default: '₹/kg'
    },
    estimatedProfit: {
      type: Number, // per acre
      required: true
    },
    investmentRequired: {
      type: Number, // per acre
      required: true
    }
  },
  
  // Cultivation Practices
  cultivationPractices: {
    spacing: {
      rowToRow: {
        type: Number,
        required: true
      },
      plantToPlant: {
        type: Number,
        required: true
      },
      unit: {
        type: String,
        default: 'cm'
      }
    },
    
    seedRate: {
      type: Number,
      required: true
    },
    seedRateUnit: {
      type: String,
      default: 'kg/acre'
    },
    
    irrigation: {
      frequency: {
        type: String,
        required: true
      },
      method: {
        type: [String],
        required: true,
        enum: ['Drip', 'Sprinkler', 'Flood', 'Furrow', 'Manual']
      }
    },
    
    fertilizers: {
      nitrogen: {
        type: Number,
        required: true
      },
      phosphorus: {
        type: Number,
        required: true
      },
      potassium: {
        type: Number,
        required: true
      },
      unit: {
        type: String,
        default: 'kg/acre'
      }
    }
  },
  
  // Pest and Disease Management
  pestManagement: {
    commonPests: [{
      name: String,
      description: String,
      controlMeasures: [String]
    }],
    
    commonDiseases: [{
      name: String,
      description: String,
      symptoms: [String],
      controlMeasures: [String]
    }]
  },
  
  // Regional Suitability
  regionalSuitability: {
    states: [{
      type: String,
      required: true
    }],
    districts: [{
      type: String
    }],
    climateZones: [{
      type: String,
      enum: ['Tropical', 'Subtropical', 'Temperate', 'Arid', 'Semi-arid']
    }]
  },
  
  // Market Information
  marketInfo: {
    demandTrend: {
      type: String,
      enum: ['High', 'Medium', 'Low', 'Fluctuating'],
      required: true
    },
    exportPotential: {
      type: Boolean,
      default: false
    },
    processingValue: {
      type: Boolean,
      default: false
    },
    storageLife: {
      type: Number, // in days
      required: true
    }
  },
  
  // Risk Factors
  riskFactors: [{
    factor: {
      type: String,
      required: true
    },
    description: String,
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true
    },
    mitigation: [String]
  }],
  
  // Additional Information
  description: {
    type: String,
    required: true
  },
  
  benefits: [String],
  
  challenges: [String],
  
  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  source: {
    type: String,
    default: 'Government Agriculture Department'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
cropSchema.index({ name: 1 });
cropSchema.index({ category: 1 });
cropSchema.index({ season: 1 });
cropSchema.index({ 'growthRequirements.soilType': 1 });
cropSchema.index({ 'regionalSuitability.states': 1 });
cropSchema.index({ isActive: 1 });

// Virtual for profit margin
cropSchema.virtual('profitMargin').get(function() {
  if (this.economicInfo.estimatedProfit && this.economicInfo.investmentRequired) {
    return Math.round((this.economicInfo.estimatedProfit / this.economicInfo.investmentRequired) * 100);
  }
  return 0;
});

// Static method to find crops by season
cropSchema.statics.findBySeason = function(season) {
  return this.find({
    season: season,
    isActive: true
  });
};

// Static method to find crops by soil type
cropSchema.statics.findBySoilType = function(soilType) {
  return this.find({
    'growthRequirements.soilType': soilType,
    isActive: true
  });
};

// Static method to find crops by region
cropSchema.statics.findByRegion = function(state) {
  return this.find({
    'regionalSuitability.states': state,
    isActive: true
  });
};

// Instance method to get crop summary
cropSchema.methods.getCropSummary = function() {
  return {
    name: this.name,
    category: this.category,
    season: this.season,
    averageYield: this.yieldInfo.averageYield,
    estimatedProfit: this.economicInfo.estimatedProfit,
    profitMargin: this.profitMargin,
    demandTrend: this.marketInfo.demandTrend,
    riskFactors: this.riskFactors.length
  };
};

module.exports = mongoose.model('Crop', cropSchema);
