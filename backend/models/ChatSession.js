const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['user', 'assistant', 'system']
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  // For voice messages
  audioUrl: {
    type: String,
    default: null
  },
  // For structured data (like form inputs)
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

const chatSessionSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  
  title: {
    type: String,
    default: 'New Chat Session',
    trim: true
  },
  
  messages: [messageSchema],
  
  // Context information for better recommendations
  context: {
    currentSeason: {
      type: String,
      enum: ['Kharif', 'Rabi', 'Zaid', 'Summer', 'Winter', 'Monsoon']
    },
    currentMonth: {
      type: Number,
      min: 1,
      max: 12
    },
    weatherConditions: {
      temperature: Number,
      humidity: Number,
      rainfall: Number,
      windSpeed: Number
    },
    soilConditions: {
      type: String,
      enum: ['Clay', 'Sandy', 'Loamy', 'Red', 'Black', 'Alluvial', 'Laterite']
    },
    budget: {
      type: Number,
      min: 0
    },
    landSize: {
      type: Number,
      min: 0.1
    }
  },
  
  // AI recommendations generated
  recommendations: [{
    cropName: {
      type: String,
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    reasoning: {
      type: String,
      required: true
    },
    estimatedYield: {
      type: Number,
      min: 0
    },
    estimatedProfit: {
      type: Number,
      min: 0
    },
    riskFactors: [String],
    suggestions: [String],
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Session metadata
  language: {
    type: String,
    default: 'English',
    enum: ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'Bengali', 'Marathi']
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Analytics
  messageCount: {
    type: Number,
    default: 0
  },
  
  sessionDuration: {
    type: Number, // in minutes
    default: 0
  },
  
  // Timestamps
  startedAt: {
    type: Date,
    default: Date.now
  },
  
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  
  endedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
chatSessionSchema.index({ farmerId: 1, createdAt: -1 });
chatSessionSchema.index({ sessionId: 1 });
chatSessionSchema.index({ 'context.currentSeason': 1 });
chatSessionSchema.index({ isActive: 1 });

// Virtual for session duration
chatSessionSchema.virtual('duration').get(function() {
  if (this.endedAt) {
    return Math.round((this.endedAt - this.startedAt) / (1000 * 60)); // minutes
  }
  return Math.round((Date.now() - this.startedAt) / (1000 * 60)); // minutes
});

// Pre-save middleware to update message count
chatSessionSchema.pre('save', function(next) {
  this.messageCount = this.messages.length;
  this.lastActivityAt = Date.now();
  next();
});

// Static method to find active sessions
chatSessionSchema.statics.findActiveSessions = function(farmerId) {
  return this.find({
    farmerId,
    isActive: true
  }).sort({ lastActivityAt: -1 });
};

// Instance method to add message
chatSessionSchema.methods.addMessage = function(role, content, metadata = {}) {
  this.messages.push({
    role,
    content,
    metadata,
    timestamp: Date.now()
  });
  return this.save();
};

// Instance method to end session
chatSessionSchema.methods.endSession = function() {
  this.isActive = false;
  this.endedAt = Date.now();
  return this.save();
};

// Instance method to get session summary
chatSessionSchema.methods.getSessionSummary = function() {
  return {
    sessionId: this.sessionId,
    title: this.title,
    messageCount: this.messageCount,
    duration: this.duration,
    recommendationsCount: this.recommendations.length,
    language: this.language,
    startedAt: this.startedAt,
    lastActivityAt: this.lastActivityAt
  };
};

module.exports = mongoose.model('ChatSession', chatSessionSchema);
