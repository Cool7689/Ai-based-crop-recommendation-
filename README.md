# 🌾 AI-Based Crop Recommendation System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Ollama](https://img.shields.io/badge/AI-Ollama%20%2B%20Llama2-purple.svg)](https://ollama.ai/)
[![Deploy](https://img.shields.io/badge/Deploy-Free%20Online-brightgreen.svg)](https://vercel.com/)

> **A FREE AI-powered farming assistant that helps farmers choose the best crops using local AI, voice commands, and multiple languages. No API keys required!**

## Features

- 🤖 **FREE AI-Powered Chat** - ChatGPT-style interface with local AI (Ollama + Llama2)
- 🌱 **Smart Crop Recommendations** - Personalized suggestions based on soil, weather, and location
- 🎤 **Voice Commands** - Speak your questions, hear AI responses
- 🌍 **Multi-Language Support** - English, Hindi, Telugu, Tamil
- 📊 **Real-Time Data** - Live weather and market price information
- 📱 **Mobile-Friendly** - Responsive design for all devices
- 🔐 **Secure Authentication** - JWT-based user management
- 💰 **Completely FREE** - No API keys, no monthly costs

## Quick Start

### Option 1: Free Online Deployment (Recommended)

**Deploy instantly for FREE:**

```bash
git clone https://github.com/Cool7689/Ai-based-crop-recommendation-.git
cd Ai-based-crop-recommendation-
./deploy-online.sh
```

**Cost: $0/month** using:
- **Frontend**: Vercel (Free)
- **Backend**: Railway (Free tier)
- **AI Service**: Railway (Free tier)
- **Database**: MongoDB Atlas (Free tier)
- **AI**: Demo mode (No API keys needed)

### Option 2: Local Development

**Prerequisites:**
- Node.js 18+
- MongoDB
- Ollama (for free local AI)

**Installation:**

```bash
git clone https://github.com/Cool7689/Ai-based-crop-recommendation-.git
cd Ai-based-crop-recommendation-
./setup-complete.sh
```

**Start services:**
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - AI Service
cd ai-service && npm start

# Terminal 3 - Frontend
cd frontend && npm start
```

**Access:** [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Node.js Backend │    │   AI Service    │
│                 │    │                 │    │                 │
│ • Chat Interface│◄──►│ • REST API      │◄──►│ • Ollama + Llama2│
│ • Voice Controls│    │ • Authentication│    │ • FREE Local AI │
│ • Multi-language│    │ • MongoDB       │    │ • No API Keys   │
│ • Mobile UI     │    │ • Security      │    │ • Demo Fallback │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  External APIs   │
                    │                 │
                    │ • OpenWeatherMap │
                    │ • Market Data    │
                    │ • MongoDB Atlas  │
                    └─────────────────┘
```

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React.js + Tailwind CSS | Modern web interface |
| **Backend** | Node.js + Express | REST API server |
| **AI Service** | Ollama + Llama2 | FREE local AI |
| **Database** | MongoDB Atlas | Cloud database |
| **Authentication** | JWT | Secure user management |
| **Voice** | Web Speech API | Speech recognition |
| **Languages** | React Context | Multi-language support |
| **Deployment** | Vercel + Railway | Free hosting |

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
├── DEPLOYMENT_GUIDE.md      # Complete deployment guide
├── DOCUMENTATION.md         # Full documentation
├── deploy-online.sh         # Free deployment script
├── setup-complete.sh        # Local setup script
└── README.md               # This file
```

## Free Deployment

### Why FREE?

- **Ollama + Llama2**: Free local AI (no OpenAI costs)
- **Vercel**: Free hosting for React apps
- **Railway**: Free tier for backend services
- **MongoDB Atlas**: Free database tier
- **Demo Mode**: Works without any API keys

### Deployment Steps

1. **Run deployment script:**
   ```bash
   ./deploy-online.sh
   ```

2. **Follow prompts for:**
   - Vercel (Frontend)
   - Railway (Backend + AI Service)
   - MongoDB Atlas (Database)

3. **Get your live URL!**

**See `DEPLOYMENT_GUIDE.md` for detailed instructions.**

## Configuration

### Environment Variables

**Frontend (.env):**
```bash
REACT_APP_API_URL=https://your-backend-url.railway.app
REACT_APP_AI_SERVICE_URL=https://your-ai-service-url.railway.app
```

**Backend (.env):**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crop-recommendation
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**AI Service (.env):**
```bash
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2
BACKEND_URL=https://your-backend-url.railway.app
```

## Documentation

- **[DOCUMENTATION.md](DOCUMENTATION.md)** - Complete project documentation
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Step-by-step deployment guide
- **[Setup Scripts](setup-complete.sh)** - Automated local setup

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Services won't start** | Check Node.js version (18+), run `npm install` |
| **Voice not working** | Use Chrome/Edge, allow microphone permissions |
| **AI not responding** | System uses demo mode if Ollama unavailable |
| **Database errors** | Check MongoDB Atlas connection string |
| **Deployment issues** | Check `DEPLOYMENT_GUIDE.md` |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Ollama](https://ollama.ai) for free local AI
- [Llama2](https://huggingface.co/meta-llama/Llama-2-7b-chat-hf) for AI model
- [Vercel](https://vercel.com) for free frontend hosting
- [Railway](https://railway.app) for free backend hosting
- [MongoDB Atlas](https://cloud.mongodb.com) for free database

## Support

If you have any questions:

1. Check the [troubleshooting](#-troubleshooting) section
2. Review `DOCUMENTATION.md` for detailed info
3. Check `DEPLOYMENT_GUIDE.md` for deployment help
4. Open an issue on GitHub

---

**⭐ Star this repository if you found it helpful!**