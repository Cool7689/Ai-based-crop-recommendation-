# AI Crop Recommendation System - Complete Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Free Online Deployment](#free-online-deployment)
5. [Local Development Setup](#local-development-setup)
6. [Configuration](#configuration)
7. [API Documentation](#api-documentation)
8. [Troubleshooting](#troubleshooting)
9. [Contributing](#contributing)

## 🌾 Overview

This is a complete AI-powered farming assistant that helps farmers choose the best crops. The system uses **FREE local AI** (Ollama + Llama2) to provide personalized crop recommendations based on soil type, weather conditions, location, and market trends.

### What Makes This Special?
- **100% FREE** - No API keys, no monthly costs
- **Real AI** - Not just demo responses
- **Local AI** - Runs on your server using Ollama
- **Hackathon Ready** - Perfect for presentations
- **Production Ready** - Can be deployed online for free

## ✨ Features

### Core Features
- 🤖 **FREE AI-Powered Chat** - ChatGPT-style interface with local AI
- 🌱 **Smart Crop Recommendations** - Personalized suggestions
- 🎤 **Voice Commands** - Speak questions, hear responses
- 🌍 **Multi-Language Support** - English, Hindi, Telugu, Tamil
- 📊 **Real-Time Data** - Weather and market information
- 📱 **Mobile-Friendly** - Works on all devices
- 🔐 **Secure Authentication** - JWT-based user management

### Technical Features
- **Ollama Integration** - Free local AI using Llama2
- **Demo Mode Fallback** - Works without Ollama
- **RAG System** - Retrieval-Augmented Generation
- **Vector Database** - Crop knowledge base
- **Caching** - Improved performance
- **Error Handling** - Robust error management

## 🏗️ Architecture

The system consists of three main components:

### Frontend (React.js)
- **Technology**: React.js + Tailwind CSS
- **Features**: Chat interface, voice controls, multi-language support
- **Deployment**: Vercel (Free)
- **Purpose**: User interface and interaction

### Backend (Node.js + Express)
- **Technology**: Node.js + Express + MongoDB
- **Features**: REST API, authentication, database management
- **Deployment**: Railway (Free tier)
- **Purpose**: API server and data management

### AI Service (Ollama + Local AI)
- **Technology**: Ollama + Llama2 + RAG
- **Features**: FREE local AI, no API keys required
- **Deployment**: Railway (Free tier)
- **Purpose**: AI processing and crop recommendations

## 🌐 Free Online Deployment

### Why FREE?
- **Ollama + Llama2**: Free local AI (no OpenAI costs)
- **Vercel**: Free hosting for React apps
- **Railway**: Free tier for backend services
- **MongoDB Atlas**: Free database tier
- **Demo Mode**: Works without any API keys

### Quick Deployment (Recommended)

**Step 1: Run the deployment script**
```bash
git clone https://github.com/Cool7689/Ai-based-crop-recommendation-.git
cd Ai-based-crop-recommendation-
./deploy-online.sh
```

**Step 2: Follow the prompts**
- Deploy Frontend to Vercel
- Deploy Backend to Railway
- Deploy AI Service to Railway
- Set up MongoDB Atlas

**Step 3: Get your live URL!**

### Detailed Deployment Steps

#### 1. Frontend Deployment (Vercel)
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

#### 2. Backend Deployment (Railway)
```bash
cd backend
npm install -g @railway/cli
railway login
railway init
railway up
```

#### 3. AI Service Deployment (Railway)
```bash
cd ai-service
railway init
railway up
```

#### 4. Database Setup (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create free account
3. Create new cluster
4. Get connection string
5. Update environment variables

### Environment Variables for Production

**Frontend (.env):**
```bash
REACT_APP_API_URL=https://your-backend-url.railway.app
REACT_APP_AI_SERVICE_URL=https://your-ai-service-url.railway.app
```

**Backend (.env):**
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crop-recommendation
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-url.vercel.app
AI_SERVICE_URL=https://your-ai-service-url.railway.app
```

**AI Service (.env):**
```bash
NODE_ENV=production
PORT=5001
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2
BACKEND_URL=https://your-backend-url.railway.app
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## 💻 Local Development Setup

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or cloud)
- Ollama (for free local AI)
- OpenWeatherMap API key (optional, for real weather data)

### Installation Steps

**Step 1: Clone the repository**
```bash
git clone https://github.com/Cool7689/Ai-based-crop-recommendation-.git
cd Ai-based-crop-recommendation-
```

**Step 2: Run the setup script**
```bash
./setup-complete.sh
```

**Step 3: Start all services**
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - AI Service
cd ai-service && npm start

# Terminal 3 - Frontend
cd frontend && npm start
```

**Step 4: Access the application**
Open [http://localhost:3000](http://localhost:3000) in your browser

### Manual Setup (Alternative)

**Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

**AI Service Setup:**
```bash
cd ai-service
npm install
cp env.example .env
# Edit .env with your configuration
npm start
```

**Frontend Setup:**
```bash
cd frontend
npm install
echo "REACT_APP_API_URL=http://localhost:5000" > .env
npm start
```

## ⚙️ Configuration

### Environment Variables

#### Backend Configuration
```bash
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
AI_SERVICE_URL=http://localhost:5001

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/crop-recommendation

# Security Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# External APIs
WEATHER_API_KEY=your-openweathermap-api-key
MARKET_API_KEY=your-market-api-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### AI Service Configuration
```bash
# Server Configuration
NODE_ENV=development
PORT=5001
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Ollama Configuration (Free Local AI)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2
OLLAMA_TEMPERATURE=0.7
OLLAMA_TOP_P=0.9
OLLAMA_MAX_TOKENS=1000

# Cache Configuration
CACHE_TTL=3600
CACHE_CHECK_PERIOD=600

# RAG Configuration
SIMILARITY_THRESHOLD=0.7
MAX_CONTEXT_LENGTH=4000
MAX_RECOMMENDATIONS=5
```

#### Frontend Configuration
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AI_SERVICE_URL=http://localhost:5001

# Feature Flags
REACT_APP_ENABLE_VOICE=true
REACT_APP_ENABLE_MULTILANG=true
```

## 📚 API Documentation

### Backend API Endpoints

#### Authentication
- `POST /api/farmers/register` - Register new farmer
- `POST /api/farmers/login` - Login farmer
- `GET /api/farmers/profile` - Get farmer profile
- `PUT /api/farmers/profile` - Update farmer profile

#### Chat
- `POST /api/chat/sessions` - Create new chat session
- `POST /api/chat/sessions/:id/messages` - Send message
- `GET /api/chat/sessions/:id` - Get chat session
- `GET /api/chat/sessions` - Get all chat sessions

#### Crops
- `GET /api/crops` - Get all crops
- `GET /api/crops/:id` - Get specific crop
- `GET /api/crops/search` - Search crops

#### Weather
- `GET /api/weather/current` - Get current weather
- `GET /api/weather/forecast` - Get weather forecast

#### Market
- `GET /api/market/prices` - Get market prices
- `GET /api/market/trends` - Get market trends

### AI Service API Endpoints

#### AI Processing
- `GET /api/ai/status` - Get AI service status
- `POST /api/ai/recommendations` - Generate crop recommendations
- `POST /api/ai/chat` - Generate chat response
- `POST /api/ai/knowledge` - Add to knowledge base
- `GET /api/ai/search` - Search knowledge base

#### Weather Integration
- `GET /api/weather/current` - Get current weather
- `GET /api/weather/forecast` - Get weather forecast
- `GET /api/weather/alerts` - Get weather alerts

#### Market Integration
- `GET /api/market/prices` - Get crop prices
- `GET /api/market/trends` - Get price trends
- `GET /api/market/insights` - Get market insights

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Services Won't Start
**Problem**: Services fail to start
**Solutions**:
- Check Node.js version (requires 18+)
- Run `npm install` in each service directory
- Check if ports are available (5000, 5001, 3000)
- Verify environment variables

#### Voice Not Working
**Problem**: Voice input/output not functioning
**Solutions**:
- Use Chrome or Edge browser
- Allow microphone permissions
- Check if Web Speech API is supported
- Test in incognito mode

#### AI Not Responding
**Problem**: AI service not generating responses
**Solutions**:
- Check if Ollama is running locally
- Verify AI service is running on port 5001
- System will use demo mode if Ollama unavailable
- Check AI service logs

#### Database Errors
**Problem**: Database connection issues
**Solutions**:
- Verify MongoDB connection string
- Check if MongoDB is running
- For MongoDB Atlas, check network access
- Verify database credentials

#### Authentication Issues
**Problem**: Login/registration not working
**Solutions**:
- Verify JWT secret configuration
- Check if backend is running
- Clear browser cache and cookies
- Check CORS settings

#### Deployment Issues
**Problem**: Deployment fails
**Solutions**:
- Check `DEPLOYMENT_GUIDE.md`
- Verify all environment variables
- Check service logs in deployment platform
- Ensure all dependencies are installed

### Getting Help

1. **Check the logs**: Look at console output for error messages
2. **Verify configuration**: Ensure all environment variables are set
3. **Test locally**: Try running the system locally first
4. **Check documentation**: Review this documentation and deployment guide
5. **Open an issue**: Create a GitHub issue with detailed error information

## 🤝 Contributing

We welcome contributions! Here's how to contribute:

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/Ai-based-crop-recommendation-.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes
5. Test your changes
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to your branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass
- Be respectful and constructive

### Areas for Contribution
- **Frontend**: UI/UX improvements, new features
- **Backend**: API enhancements, performance optimizations
- **AI Service**: Better prompts, new AI models
- **Documentation**: Improvements, examples, tutorials
- **Testing**: Unit tests, integration tests
- **Deployment**: Deployment scripts, configuration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai) for free local AI
- [Llama2](https://huggingface.co/meta-llama/Llama-2-7b-chat-hf) for AI model
- [Vercel](https://vercel.com) for free frontend hosting
- [Railway](https://railway.app) for free backend hosting
- [MongoDB Atlas](https://cloud.mongodb.com) for free database
- [React](https://reactjs.org) for the frontend framework
- [Node.js](https://nodejs.org) for the backend runtime

## 💬 Support

If you have any questions or need help:

1. **Check this documentation** - Most questions are answered here
2. **Check the troubleshooting section** - Common issues and solutions
3. **Review the deployment guide** - For deployment-specific help
4. **Open a GitHub issue** - For bugs or feature requests
5. **Check the README** - For quick start information

---

**⭐ Star this repository if you found it helpful!**

**🚀 Ready for your hackathon? Deploy for FREE in minutes!**