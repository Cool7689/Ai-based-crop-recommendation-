# 🌾 AI-Based Crop Recommendation System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5--turbo-orange.svg)](https://openai.com/)

> **An intelligent farming assistant that helps farmers choose the best crops using AI, voice commands, and multiple languages.**

## Features

- 🤖 **AI-Powered Chat** - ChatGPT-style interface for farming advice
- 🌱 **Smart Crop Recommendations** - Personalized suggestions based on soil, weather, and location
- 🎤 **Voice Commands** - Speak your questions, hear AI responses
- 🌍 **Multi-Language Support** - English, Hindi, Telugu, Tamil
- 📊 **Real-Time Data** - Live weather and market price information
- 📱 **Mobile-Friendly** - Responsive design for all devices
- 🔐 **Secure Authentication** - JWT-based user management

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB
- OpenAI API Key
- OpenWeatherMap API Key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Cool7689/Ai-based-crop-recommendation-.git
cd Ai-based-crop-recommendation-
```

2. **Run setup script**
```bash
./setup-complete.sh
```

3. **Configure environment variables**
```bash
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/crop-recommendation
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-your-openai-key
WEATHER_API_KEY=your-openweathermap-key

# AI Service (.env)
OPENAI_API_KEY=sk-your-openai-key
PORT=5001

# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000
```

4. **Start the services**
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - AI Service
cd ai-service && npm start

# Terminal 3 - Frontend
cd frontend && npm start
```

5. **Access the application**
Open [http://localhost:3000](http://localhost:3000) in your browser

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Node.js Backend │    │   AI Service    │
│                 │    │                 │    │                 │
│ • Chat Interface│◄──►│ • REST API      │◄──►│ • OpenAI GPT    │
│ • Voice Controls│    │ • Authentication│    │ • RAG System    │
│ • Multi-language│    │ • MongoDB       │    │ • Vector DB     │
│ • Mobile UI     │    │ • Security      │    │ • Caching       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  External APIs   │
                    │                 │
                    │ • OpenWeatherMap │
                    │ • Market Data    │
                    │ • OpenAI API     │
                    └─────────────────┘
```

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React.js + Tailwind CSS | Modern web interface |
| **Backend** | Node.js + Express | REST API server |
| **AI Service** | OpenAI GPT-3.5-turbo | Intelligent responses |
| **Database** | MongoDB | Data storage |
| **Authentication** | JWT | Secure user management |
| **Voice** | Web Speech API | Speech recognition |
| **Languages** | React Context | Multi-language support |

## Project Structure

```
magita/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   └── App.js          # Main app component
│   └── package.json
├── backend/                  # Node.js backend
│   ├── controllers/         # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── server.js           # Main server file
├── ai-service/              # AI processing service
│   ├── services/           # AI service logic
│   ├── routes/             # AI endpoints
│   └── server.js           # AI server
├── docs/                   # Documentation
├── setup-complete.sh       # One-click setup
└── README.md              # This file
```

## API Keys Setup

### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

### OpenWeatherMap API Key
1. Visit [OpenWeatherMap API](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to API Keys section
4. Copy your API key

### MongoDB Atlas (Free)
1. Visit [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free account
3. Create a new cluster
4. Get the connection string

## Deployment

### Production Deployment

**Backend & AI Service:**
- [Heroku](https://heroku.com) - Easy deployment
- [Railway](https://railway.app) - Modern platform
- [DigitalOcean](https://digitalocean.com) - VPS hosting

**Frontend:**
- [Vercel](https://vercel.com) - Optimized for React
- [Netlify](https://netlify.com) - Static site hosting

**Database:**
- [MongoDB Atlas](https://cloud.mongodb.com) - Cloud database

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

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Services won't start** | Check Node.js version (18+), run `npm install` |
| **Voice not working** | Use Chrome/Edge, allow microphone permissions |
| **AI not responding** | Verify OpenAI API key, check AI service status |
| **Database errors** | Check MongoDB connection string |
| **Authentication issues** | Verify JWT secret configuration |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OpenAI](https://openai.com) for GPT-3.5-turbo
- [OpenWeatherMap](https://openweathermap.org) for weather data
- [React](https://reactjs.org) for the frontend framework
- [Node.js](https://nodejs.org) for the backend runtime

## Support

If you have any questions or need help:

1. Check the [troubleshooting](#-troubleshooting) section
2. Review the console for error messages
3. Verify all services are running
4. Check your API keys configuration

---

**⭐ Star this repository if you found it helpful!**