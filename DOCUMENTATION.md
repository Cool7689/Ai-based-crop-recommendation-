# AI Crop Recommendation System - Documentation

## Overview

This is a complete AI-powered farming assistant that helps farmers choose the best crops. The system uses artificial intelligence to provide personalized crop recommendations based on soil type, weather conditions, location, and market trends.

## What It Does

The system provides farmers with:
- Smart crop recommendations using AI
- Chat interface for asking farming questions
- Voice input and output capabilities
- Support for multiple languages (English, Hindi, Telugu, Tamil)
- Real-time weather data
- Market price information
- Mobile-friendly interface

## How It Works

1. Farmers register with their farm details (location, soil type, land size)
2. They can chat with an AI assistant about farming questions
3. The AI provides personalized crop recommendations
4. Voice features allow farmers to speak questions and hear responses
5. The system works in multiple regional languages

## Technical Architecture

The system consists of three main components:

**Frontend (React.js)**
- User interface with chat functionality
- Voice input/output controls
- Multi-language support
- Mobile-responsive design

**Backend (Node.js + Express)**
- REST API with authentication
- Database management
- Security and error handling
- Integration with external services

**AI Service (Ollama + Local AI)**
- FREE local AI using Ollama and Llama2
- No API keys required for AI features
- RAG (Retrieval-Augmented Generation) system
- Vector database for crop knowledge
- Multi-language AI responses

## Project Structure

```
magita/
├── frontend/          # React.js web application
├── backend/           # Node.js API server
├── ai-service/        # AI processing service
├── docs/             # Documentation files
└── setup-complete.sh # Setup script
```

## Free Online Deployment

The system can be deployed online for **FREE** using:

- **Frontend**: Vercel (Free hosting)
- **Backend**: Railway (Free tier)
- **AI Service**: Railway (Free tier) 
- **Database**: MongoDB Atlas (Free tier)
- **AI**: Demo mode (No API keys required)

### Quick Deployment

1. **Run the deployment script:**
   ```bash
   ./deploy-online.sh
   ```

2. **Follow the prompts** to deploy to:
   - Vercel (Frontend)
   - Railway (Backend + AI Service)
   - MongoDB Atlas (Database)

3. **No API keys needed** - System works in demo mode

### Cost: $0/month

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## Setup Instructions

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or cloud)
- Ollama (for free local AI)
- OpenWeatherMap API key (optional, for real weather data)

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/Cool7689/Ai-based-crop-recommendation-.git
cd Ai-based-crop-recommendation-
```

2. Run the setup script
```bash
./setup-complete.sh
```

3. Configure environment variables

Create `.env` files in each service directory:

**backend/.env:**
```
MONGODB_URI=mongodb://localhost:27017/crop-recommendation
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-your-openai-key
WEATHER_API_KEY=your-openweathermap-key
AI_SERVICE_URL=http://localhost:5001
```

**ai-service/.env:**
```
OPENAI_API_KEY=sk-your-openai-key
PORT=5001
```

**frontend/.env:**
```
REACT_APP_API_URL=http://localhost:5000
```

4. Start the services

Open three terminal windows and run:

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - AI Service
cd ai-service
npm start

# Terminal 3 - Frontend
cd frontend
npm start
```

5. Access the application

Open http://localhost:3000 in your browser

## Getting API Keys

### OpenAI API Key
1. Visit https://platform.openai.com
2. Sign up for a free account
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with sk-)

### OpenWeatherMap API Key
1. Visit https://openweathermap.org/api
2. Sign up for a free account
3. Go to API Keys section
4. Copy your API key

### MongoDB Atlas (Free)
1. Visit https://cloud.mongodb.com
2. Create a free account
3. Create a new cluster
4. Get the connection string

## Key Features

**AI Chat Interface**
- ChatGPT-style conversation with farmers
- Context-aware responses
- Session management
- Message history

**Voice Features**
- Speech recognition for input
- Text-to-speech for responses
- Multi-language voice support
- Browser-based implementation

**Multi-language Support**
- English, Hindi, Telugu, Tamil
- UI translation
- AI responses in selected language
- Language switcher component

**Real Data Integration**
- Live weather data from OpenWeatherMap
- Market price information
- Regional crop data
- Seasonal recommendations

**User Management**
- Farmer registration and login
- Profile management
- Farm details storage
- Secure authentication

## API Endpoints

**Authentication**
- POST /api/auth/register - Register new farmer
- POST /api/auth/login - Login farmer
- GET /api/auth/profile - Get farmer profile

**Chat**
- POST /api/chat/session - Create chat session
- POST /api/chat/message - Send message to AI
- GET /api/chat/sessions - Get chat history

**Data**
- GET /api/crops - Get crop information
- GET /api/weather/current - Get current weather
- GET /api/market/prices - Get market prices

## Database Models

**Farmer Model**
- Personal information (name, email, phone)
- Location details (state, district, village)
- Farm details (soil type, land area, irrigation)
- Preferences (language, subscription type)

**ChatSession Model**
- Session information and metadata
- Message history
- Context data
- Recommendations

**Crop Model**
- Crop information and requirements
- Growth timeline and yield data
- Economic information
- Regional suitability

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting for API endpoints
- CORS protection
- Input validation
- Error handling and logging

## Deployment

### Production Deployment Options

**Backend and AI Service:**
- Heroku (easy deployment)
- Railway (modern platform)
- DigitalOcean (VPS hosting)

**Frontend:**
- Vercel (optimized for React)
- Netlify (static site hosting)

**Database:**
- MongoDB Atlas (cloud database)

### Environment Variables for Production

```bash
# Backend
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crop-recommendation
JWT_SECRET=your-production-secret-key
OPENAI_API_KEY=sk-your-openai-key
WEATHER_API_KEY=your-openweathermap-key
AI_SERVICE_URL=https://your-ai-service-url

# AI Service
OPENAI_API_KEY=sk-your-openai-key
PORT=5001

# Frontend
REACT_APP_API_URL=https://your-backend-url
```

## Testing

### Manual Testing Checklist
- User registration and login
- Chat functionality with AI
- Voice input and output
- Language switching
- Mobile responsiveness
- Weather data integration
- Market price information

### Automated Testing
```bash
# Backend API tests
cd backend
npm test

# Test all endpoints
node test-api.js
```

## Troubleshooting

**Common Issues and Solutions:**

**Services won't start**
- Check Node.js version (18+ required)
- Run npm install in each directory
- Verify MongoDB is running

**Voice features not working**
- Use Chrome or Edge browser
- Allow microphone permissions
- Check internet connection

**AI not responding**
- Verify OpenAI API key is correct
- Check AI service is running
- Review console for error messages

**Database connection errors**
- Check MongoDB connection string
- Verify database is accessible
- Check network connectivity

**Authentication issues**
- Verify JWT secret configuration
- Check token expiration
- Review authentication middleware

## Performance Considerations

- Caching for AI responses
- Database indexing for faster queries
- Compression middleware
- Optimized API endpoints
- Lazy loading for frontend components

## Future Enhancements

- Mobile app development
- Additional language support
- Advanced analytics dashboard
- Image recognition for crop diseases
- Integration with IoT sensors
- Machine learning model training

## Support

For technical support:
1. Check the troubleshooting section
2. Review console logs for errors
3. Verify all services are running
4. Check environment variable configuration
5. Test individual components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

This documentation covers everything needed to understand, set up, and deploy the AI Crop Recommendation System.
