const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Farmer name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  // Location Information
  location: {
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    village: {
      type: String,
      required: [true, 'Village is required'],
      trim: true
    },
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required']
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required']
      }
    }
  },
  
  // Farm Information
  farmDetails: {
    totalLandArea: {
      type: Number,
      required: [true, 'Total land area is required'],
      min: [0.1, 'Land area must be at least 0.1 acres']
    },
    irrigatedArea: {
      type: Number,
      default: 0,
      min: [0, 'Irrigated area cannot be negative']
    },
    soilType: {
      type: String,
      required: [true, 'Soil type is required'],
      enum: ['Clay', 'Sandy', 'Loamy', 'Red', 'Black', 'Alluvial', 'Laterite']
    },
    soilPh: {
      type: Number,
      min: [0, 'pH cannot be negative'],
      max: [14, 'pH cannot exceed 14']
    }
  },
  
  // Preferences
  preferredLanguage: {
    type: String,
    default: 'English',
    enum: ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'Bengali', 'Marathi']
  },
  
  // Subscription and Settings
  isActive: {
    type: Boolean,
    default: true
  },
  
  subscriptionType: {
    type: String,
    default: 'free',
    enum: ['free', 'premium', 'enterprise']
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full address
farmerSchema.virtual('fullAddress').get(function() {
  return `${this.location.village}, ${this.location.district}, ${this.location.state}`;
});

// Index for better query performance
farmerSchema.index({ phone: 1 });
farmerSchema.index({ email: 1 });
farmerSchema.index({ 'location.coordinates': '2dsphere' });
farmerSchema.index({ 'location.state': 1, 'location.district': 1 });

// Pre-save middleware
farmerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to find farmers by location
farmerSchema.statics.findByLocation = function(state, district) {
  return this.find({
    'location.state': state,
    'location.district': district,
    isActive: true
  });
};

// Instance method to get farm summary
farmerSchema.methods.getFarmSummary = function() {
  return {
    totalArea: this.farmDetails.totalLandArea,
    irrigatedArea: this.farmDetails.irrigatedArea,
    soilType: this.farmDetails.soilType,
    irrigationPercentage: Math.round((this.farmDetails.irrigatedArea / this.farmDetails.totalLandArea) * 100)
  };
};

module.exports = mongoose.model('Farmer', farmerSchema);
