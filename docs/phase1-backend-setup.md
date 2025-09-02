# Phase 1: Backend Setup Documentation

## Overview
Phase 1 focuses on setting up the foundational backend infrastructure for the AI-based crop recommendation system. This phase establishes the core API structure, database models, authentication system, and basic functionality.

## Architecture Overview

### Tech Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Built-in validation with error handling

### Project Structure
```
backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── chatController.js    # Chat session and messaging logic
│   ├── farmerController.js  # Farmer authentication and profile management
│   ├── cropController.js    # Crop data and search functionality
│   ├── weatherController.js # Weather data (placeholder for Phase 2)
│   └── marketController.js # Market data (placeholder for Phase 2)
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── Farmer.js            # Farmer data model
│   ├── ChatSession.js       # Chat conversation model
│   └── Crop.js              # Crop information model
├── routes/
│   ├── chat.js              # Chat API endpoints
│   ├── farmers.js           # Farmer management endpoints
│   ├── crops.js             # Crop data endpoints
│   ├── weather.js           # Weather API endpoints
│   └── market.js            # Market API endpoints
├── server.js                # Main application entry point
├── package.json             # Dependencies and scripts
├── env.example             # Environment variables template
└── test-api.js             # API testing script
```

## Database Models

### 1. Farmer Model
**Purpose**: Store farmer information and farm details

**Key Fields**:
- Basic Info: `name`, `phone`, `email`, `password`
- Location: `state`, `district`, `village`, `coordinates`
- Farm Details: `totalLandArea`, `irrigatedArea`, `soilType`, `soilPh`
- Preferences: `preferredLanguage`, `subscriptionType`

**Features**:
- Password hashing with bcrypt
- Email and phone validation
- Geospatial indexing for location-based queries
- Virtual fields for computed data

### 2. ChatSession Model
**Purpose**: Store conversation history and AI recommendations

**Key Fields**:
- Session Info: `sessionId`, `title`, `language`, `isActive`
- Messages: Array of user and AI messages with timestamps
- Context: `currentSeason`, `weatherConditions`, `soilConditions`
- Recommendations: AI-generated crop suggestions with confidence scores

**Features**:
- Message history with metadata
- Context tracking for better recommendations
- Analytics: session duration, message count
- Support for voice messages (Phase 3)

### 3. Crop Model
**Purpose**: Comprehensive crop information database

**Key Fields**:
- Basic Info: `name`, `scientificName`, `localNames` (multi-language)
- Classification: `category`, `season`
- Growth Requirements: `soilType`, `temperature`, `rainfall`, `humidity`
- Economic Data: `averagePrice`, `estimatedProfit`, `investmentRequired`
- Cultivation: `spacing`, `irrigation`, `fertilizers`
- Regional Data: `states`, `districts`, `climateZones`

**Features**:
- Multi-language support for local names
- Comprehensive growth requirements
- Economic analysis data
- Regional suitability mapping

## Authentication System

### JWT Implementation
- **Token Structure**: `{ farmerId: ObjectId }`
- **Expiration**: Configurable (default: 7 days)
- **Security**: Signed with environment secret
- **Storage**: Client-side (localStorage/sessionStorage)

### Middleware Functions
1. **`auth`**: Required authentication for protected routes
2. **`optionalAuth`**: Optional authentication for public routes
3. **`authorize`**: Role-based access control

### Security Features
- Password hashing with bcrypt (salt rounds: 10)
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation and sanitization

## API Endpoints

### Authentication Routes (`/api/farmers`)
- `POST /register` - Farmer registration
- `POST /login` - Farmer login
- `GET /profile` - Get farmer profile (protected)
- `PUT /profile` - Update farmer profile (protected)
- `PUT /farm-details` - Update farm information (protected)
- `PUT /preferences` - Update language preferences (protected)

### Chat Routes (`/api/chat`)
- `POST /session` - Create new chat session (protected)
- `GET /session/:sessionId` - Get session details (protected)
- `GET /sessions` - Get user's chat sessions (protected)
- `PUT /session/:sessionId/end` - End chat session (protected)
- `POST /message` - Send message (protected)
- `GET /session/:sessionId/messages` - Get session messages (protected)
- `POST /recommend` - Get AI recommendation (protected)

### Crop Routes (`/api/crops`)
- `GET /` - Get all crops (public)
- `GET /:cropId` - Get specific crop (public)
- `GET /category/:category` - Get crops by category (public)
- `GET /season/:season` - Get crops by season (public)
- `GET /soil/:soilType` - Get crops by soil type (public)
- `GET /region/:state` - Get crops by region (public)
- `GET /search/:query` - Search crops (public)
- `POST /filter` - Filter crops (public)
- `GET /recommendations/quick` - Quick recommendations (public)

### Weather Routes (`/api/weather`)
- `GET /current/:location` - Current weather (public)
- `GET /forecast/:location` - Weather forecast (public)
- `GET /historical/:location` - Historical weather (public)
- `GET /alerts/:location` - Weather alerts (public)

### Market Routes (`/api/market`)
- `GET /prices/:crop` - Crop prices (public)
- `GET /prices` - All crop prices (public)
- `GET /trends/:crop` - Price trends (public)
- `GET /insights` - Market insights (public)

## Getting Started

### Prerequisites
1. Node.js (v18 or higher)
2. MongoDB (local or cloud)
3. Git

### Installation Steps

1. **Clone and Setup**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```bash
   # Ensure MongoDB is running
   # Update MONGODB_URI in .env
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Test API**
   ```bash
   node test-api.js
   ```

### Environment Variables
```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/crop_recommendation

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Testing

### Manual Testing
Use the provided `test-api.js` script to test all endpoints:
```bash
node test-api.js
```

### API Testing Tools
- **Postman**: Import the API collection
- **Insomnia**: Use the provided workspace
- **cURL**: Command-line testing

### Test Coverage
- Health check endpoint
- Farmer registration and login
- Chat session management
- Message sending and retrieval
- Crop search and filtering
- Weather data endpoints
- Market data endpoints

## Development Guidelines

### Code Style
- Use ES6+ features
- Follow Express.js best practices
- Implement proper error handling
- Use async/await for database operations
- Add comprehensive logging

### Error Handling
- Consistent error response format
- Proper HTTP status codes
- Detailed error messages for development
- Generic messages for production

### Security Best Practices
- Validate all inputs
- Sanitize user data
- Use HTTPS in production
- Implement rate limiting
- Secure headers with Helmet

## Performance Considerations

### Database Optimization
- Indexed fields for common queries
- Geospatial indexing for location data
- Compound indexes for complex queries
- Connection pooling

### API Optimization
- Response compression
- Pagination for large datasets
- Caching strategies (Phase 2)
- Rate limiting to prevent abuse

## Phase 1 Limitations

### Current Limitations
1. **Mock Data**: Weather and market APIs return mock data
2. **Basic AI**: Chat responses are simple acknowledgments
3. **No Voice**: Voice features are placeholders
4. **Limited Analytics**: Basic analytics implementation
5. **No Real-time**: No WebSocket implementation

### Phase 2 Improvements
1. **AI Integration**: OpenAI GPT integration with RAG
2. **Real APIs**: Weather and market data integration
3. **Advanced Analytics**: Comprehensive analytics dashboard
4. **Performance**: Caching and optimization
5. **Testing**: Unit and integration tests

## Next Steps

### Phase 2 Preparation
1. Set up OpenAI API credentials
2. Prepare crop knowledge base
3. Design RAG implementation
4. Plan weather API integration
5. Design market data sources

### Deployment Preparation
1. Environment configuration
2. Database migration scripts
3. Logging and monitoring setup
4. Security hardening
5. Performance optimization

## Learning Objectives Achieved

### Backend Development
- Express.js framework mastery
- MongoDB with Mongoose ODM
- RESTful API design
- Authentication and authorization
- Error handling and validation
- Security best practices

### Database Design
- Schema design and relationships
- Indexing strategies
- Data validation
- Geospatial queries
- Performance optimization

### API Development
- Route organization
- Middleware implementation
- Request/response handling
- Status codes and error messages
- Documentation and testing

---

**Phase 1 Status**: Complete  
**Ready for Phase 2**: AI Integration
