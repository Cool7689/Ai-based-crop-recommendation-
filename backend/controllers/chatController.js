const ChatSession = require('../models/ChatSession');
const Farmer = require('../models/Farmer');
const { v4: uuidv4 } = require('uuid');

// Create a new chat session
const createSession = async (req, res) => {
  try {
    const { title, language } = req.body;
    const farmerId = req.farmer._id;

    const session = new ChatSession({
      farmerId,
      sessionId: uuidv4(),
      title: title || 'New Chat Session',
      language: language || req.farmer.preferredLanguage || 'English',
      context: {
        currentSeason: getCurrentSeason(),
        currentMonth: new Date().getMonth() + 1
      }
    });

    await session.save();

    res.status(201).json({
      success: true,
      message: 'Chat session created successfully',
      data: {
        sessionId: session.sessionId,
        title: session.title,
        language: session.language,
        startedAt: session.startedAt
      }
    });

  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create chat session',
      message: error.message
    });
  }
};

// Get a specific chat session
const getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const farmerId = req.farmer._id;

    const session = await ChatSession.findOne({
      sessionId,
      farmerId,
      isActive: true
    }).populate('farmerId', 'name location');

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
        message: 'Chat session does not exist or has ended'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        session: session.getSessionSummary(),
        messages: session.messages.slice(-50), // Last 50 messages
        recommendations: session.recommendations
      }
    });

  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get chat session',
      message: error.message
    });
  }
};

// Get all user sessions
const getUserSessions = async (req, res) => {
  try {
    const farmerId = req.farmer._id;
    const { page = 1, limit = 10 } = req.query;

    const sessions = await ChatSession.find({
      farmerId,
      isActive: true
    })
    .sort({ lastActivityAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('sessionId title language messageCount duration startedAt lastActivityAt recommendations');

    const total = await ChatSession.countDocuments({
      farmerId,
      isActive: true
    });

    res.status(200).json({
      success: true,
      data: {
        sessions,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalSessions: total
      }
    });

  } catch (error) {
    console.error('Get user sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user sessions',
      message: error.message
    });
  }
};

// End a chat session
const endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const farmerId = req.farmer._id;

    const session = await ChatSession.findOne({
      sessionId,
      farmerId,
      isActive: true
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
        message: 'Chat session does not exist or has already ended'
      });
    }

    await session.endSession();

    res.status(200).json({
      success: true,
      message: 'Chat session ended successfully',
      data: {
        sessionId: session.sessionId,
        duration: session.duration,
        messageCount: session.messageCount
      }
    });

  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to end chat session',
      message: error.message
    });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { sessionId, content, metadata = {} } = req.body;
    const farmerId = req.farmer._id;

    const session = await ChatSession.findOne({
      sessionId,
      farmerId,
      isActive: true
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
        message: 'Chat session does not exist or has ended'
      });
    }

    // Add user message
    await session.addMessage('user', content, metadata);

    // TODO: Process with AI and get response
    // For now, send a simple acknowledgment
    const aiResponse = `Thank you for your message: "${content}". I'm here to help you with crop recommendations. Please provide more details about your location, soil type, and preferences for better suggestions.`;

    // Add AI response
    await session.addMessage('assistant', aiResponse);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        sessionId: session.sessionId,
        userMessage: content,
        aiResponse: aiResponse,
        messageCount: session.messageCount
      }
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
      message: error.message
    });
  }
};

// Get messages from a session
const getMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const farmerId = req.farmer._id;

    const session = await ChatSession.findOne({
      sessionId,
      farmerId,
      isActive: true
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
        message: 'Chat session does not exist or has ended'
      });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const messages = session.messages.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: {
        messages,
        totalMessages: session.messages.length,
        currentPage: page,
        totalPages: Math.ceil(session.messages.length / limit)
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get messages',
      message: error.message
    });
  }
};

// Get AI recommendation
const getRecommendation = async (req, res) => {
  try {
    const { sessionId, context } = req.body;
    const farmerId = req.farmer._id;

    const session = await ChatSession.findOne({
      sessionId,
      farmerId,
      isActive: true
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
        message: 'Chat session does not exist or has ended'
      });
    }

    // TODO: Implement AI recommendation logic
    // For now, return a mock recommendation
    const mockRecommendation = {
      cropName: 'Rice',
      confidence: 0.85,
      reasoning: 'Based on your location and current season, rice is highly suitable for your region.',
      estimatedYield: 2500,
      estimatedProfit: 45000,
      riskFactors: ['Weather dependency', 'Water requirement'],
      suggestions: ['Ensure proper irrigation', 'Monitor weather forecasts']
    };

    // Add recommendation to session
    session.recommendations.push({
      ...mockRecommendation,
      timestamp: Date.now()
    });
    await session.save();

    res.status(200).json({
      success: true,
      message: 'Recommendation generated successfully',
      data: {
        recommendation: mockRecommendation,
        sessionId: session.sessionId
      }
    });

  } catch (error) {
    console.error('Get recommendation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get recommendation',
      message: error.message
    });
  }
};

// Get session recommendations
const getSessionRecommendations = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const farmerId = req.farmer._id;

    const session = await ChatSession.findOne({
      sessionId,
      farmerId,
      isActive: true
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
        message: 'Chat session does not exist or has ended'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        recommendations: session.recommendations,
        totalRecommendations: session.recommendations.length
      }
    });

  } catch (error) {
    console.error('Get session recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get session recommendations',
      message: error.message
    });
  }
};

// Handle voice message
const handleVoiceMessage = async (req, res) => {
  try {
    // TODO: Implement voice processing
    res.status(200).json({
      success: true,
      message: 'Voice message processing will be implemented in Phase 3',
      data: {
        messageId: 'voice_' + Date.now(),
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Handle voice message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process voice message',
      message: error.message
    });
  }
};

// Get voice response
const getVoiceResponse = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    // TODO: Implement voice response generation
    res.status(200).json({
      success: true,
      message: 'Voice response generation will be implemented in Phase 3',
      data: {
        messageId,
        audioUrl: null,
        status: 'not_implemented'
      }
    });

  } catch (error) {
    console.error('Get voice response error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get voice response',
      message: error.message
    });
  }
};

// Helper function to get current season
const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  
  if (month >= 6 && month <= 9) {
    return 'Kharif';
  } else if (month >= 10 && month <= 12) {
    return 'Rabi';
  } else if (month >= 1 && month <= 2) {
    return 'Rabi';
  } else {
    return 'Zaid';
  }
};

module.exports = {
  createSession,
  getSession,
  getUserSessions,
  endSession,
  sendMessage,
  getMessages,
  getRecommendation,
  getSessionRecommendations,
  handleVoiceMessage,
  getVoiceResponse
};
