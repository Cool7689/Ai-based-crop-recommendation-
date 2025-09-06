# AI Crop Recommendation System
## Documentation

Hey there! 

This is the documentation for our AI Crop Recommendation System - a project we built to help farmers get smart crop recommendations using AI. We wanted to make something that actually helps farmers without costing them money, so we built it to run completely free.

## What This Project Does

Basically, we created a web app that farmers can use to:
- Get personalized crop recommendations based on their soil, location, and weather
- Chat with an AI assistant about farming questions (like ChatGPT but for farming)
- Use voice commands to ask questions and hear responses
- Get information in their local language (English, Hindi, Telugu, Tamil)
- See real-time weather and market data

The cool part? It's completely free to run and doesn't need any API keys for the AI part.

## How We Built It

We split the project into three main parts:

### Frontend (What Users See)
- **React.js** - Because it's great for building user interfaces
- **Tailwind CSS** - Makes styling easy and looks good
- **Voice features** - Using the browser's built-in speech recognition
- **Multi-language support** - So farmers can use it in their language

### Backend (The Brain)
- **Node.js + Express** - Handles all the API requests
- **MongoDB** - Stores user data, chat history, and crop information
- **JWT authentication** - Keeps user accounts secure
- **Rate limiting** - Prevents abuse

### AI Service (The Smart Part)
- **Ollama + Llama2** - Free local AI that runs on our server
- **RAG system** - Makes the AI responses more accurate
- **Caching** - Speeds things up by remembering previous responses
- **Demo mode** - Works even when Ollama isn't available

## Project Structure

Here's how we organized everything:

```
magita/
├── frontend/          # The website users see
│   ├── src/
│   │   ├── components/    # Reusable pieces (buttons, forms, etc.)
│   │   ├── pages/         # Different pages (chat, login, etc.)
│   │   ├── contexts/      # Manages user login and language
│   │   └── App.js         # Main app file
│   └── package.json       # What libraries we use
│
├── backend/           # The server that handles requests
│   ├── controllers/   # Handles different types of requests
│   ├── models/        # Database structure
│   ├── routes/        # API endpoints
│   ├── middleware/    # Security and validation
│   └── server.js      # Main server file
│
├── ai-service/        # The AI that gives recommendations
│   ├── services/      # AI logic
│   ├── routes/        # AI API endpoints
│   ├── data/          # Knowledge base
│   └── server.js      # AI server
│
└── docs/              # Documentation files
```

## How to Set It Up

### Option 1: Quick Setup (Recommended)
```bash
git clone https://github.com/Cool7689/Ai-based-crop-recommendation-.git
cd Ai-based-crop-recommendation-
./setup-complete.sh
```

This script will:
- Install all the dependencies
- Set up Ollama for free AI
- Create the database
- Start all services

### Option 2: Manual Setup
If you want to do it step by step:

1. **Install Node.js** (version 18 or higher)
2. **Install MongoDB** (or use MongoDB Atlas free tier)
3. **Clone the repository**
4. **Set up each service**:
   ```bash
   # Backend
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your settings
   
   # AI Service
   cd ai-service
   npm install
   cp env.example .env
   
   # Frontend
   cd frontend
   npm install
   echo "REACT_APP_API_URL=http://localhost:5000" > .env
   ```

5. **Start everything**:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start
   
   # Terminal 2 - AI Service
   cd ai-service && npm start
   
   # Terminal 3 - Frontend
   cd frontend && npm start
   ```

6. **Open your browser** to `http://localhost:3000`

## Configuration

### Environment Variables

You'll need to set up some environment variables. Here's what each service needs:

#### Backend (.env)
```bash
# Basic settings
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/crop-recommendation

# Security
JWT_SECRET=your-secret-key-here

# URLs
FRONTEND_URL=http://localhost:3000
AI_SERVICE_URL=http://localhost:5001

# Optional: External APIs
WEATHER_API_KEY=your-openweathermap-key
MARKET_API_KEY=your-market-api-key
```

#### AI Service (.env)
```bash
# Basic settings
NODE_ENV=development
PORT=5001

# Ollama (free AI)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# URLs
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Cache settings
CACHE_TTL=3600
```

#### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AI_SERVICE_URL=http://localhost:5001
```

## API Endpoints

Here are the main API endpoints you can use:

### Authentication
- `POST /api/farmers/register` - Create new farmer account
- `POST /api/farmers/login` - Login farmer
- `GET /api/farmers/profile` - Get farmer info
- `PUT /api/farmers/profile` - Update farmer info

### Chat
- `POST /api/chat/sessions` - Start new chat
- `POST /api/chat/sessions/:id/messages` - Send message
- `GET /api/chat/sessions/:id` - Get chat history
- `GET /api/chat/sessions` - Get all chats

### Data
- `GET /api/crops` - Get crop list
- `GET /api/crops/search` - Search crops
- `GET /api/weather/current` - Get weather
- `GET /api/market/prices` - Get market prices

### AI Service
- `GET /api/ai/status` - Check AI service
- `POST /api/ai/recommendations` - Get crop recommendations
- `POST /api/ai/chat` - Get AI response

## Database Models

### Farmer
Stores farmer information:
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  location: {
    state: "Punjab",
    district: "Ludhiana"
  },
  farmDetails: {
    soilType: "clay",
    totalLandArea: 5,
    irrigatedArea: 3
  },
  preferredLanguage: "English"
}
```

### ChatSession
Stores chat conversations:
```javascript
{
  farmerId: "farmer_id",
  title: "Crop Recommendation",
  messages: [
    {
      role: "user",
      content: "What crops should I grow?",
      timestamp: "2024-01-01T10:00:00Z"
    },
    {
      role: "assistant", 
      content: "Based on your soil type...",
      timestamp: "2024-01-01T10:01:00Z"
    }
  ],
  context: {
    soilType: "clay",
    season: "monsoon"
  }
}
```

### Crop
Stores crop information:
```javascript
{
  name: "Rice",
  scientificName: "Oryza sativa",
  category: "cereal",
  season: ["kharif"],
  growthRequirements: {
    soilType: ["clay", "loam"],
    temperature: { min: 20, max: 35 },
    rainfall: { min: 1000, max: 2000 }
  },
  yieldInfo: {
    averageYield: 4000, // kg per acre
    yieldRange: { min: 3000, max: 5000 }
  }
}
```

## Deployment

### Free Online Deployment

We set this up to deploy for free using:
- **Vercel** - Hosts the frontend (free)
- **Railway** - Hosts backend and AI service (free tier)
- **MongoDB Atlas** - Database (free tier)

#### Quick Deployment
```bash
./deploy-online.sh
```

This will guide you through deploying to all platforms.

#### Manual Deployment

1. **Frontend to Vercel**:
   ```bash
   cd frontend
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Backend to Railway**:
   ```bash
   cd backend
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

3. **AI Service to Railway**:
   ```bash
   cd ai-service
   railway init
   railway up
   ```

4. **Database to MongoDB Atlas**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create free account
   - Create cluster
   - Get connection string
   - Update environment variables

### Production Environment Variables

Update these for production:

#### Frontend
```bash
REACT_APP_API_URL=https://your-backend-url.railway.app
REACT_APP_AI_SERVICE_URL=https://your-ai-service-url.railway.app
```

#### Backend
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/crop-recommendation
JWT_SECRET=your-production-secret
FRONTEND_URL=https://your-frontend-url.vercel.app
```

#### AI Service
```bash
NODE_ENV=production
BACKEND_URL=https://your-backend-url.railway.app
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## Troubleshooting

### Common Issues

**Services won't start?**
- Check if Node.js version is 18+
- Make sure ports 3000, 5000, 5001 are free
- Run `npm install` in each directory
- Check your .env files

**Database connection issues?**
- Verify MongoDB connection string
- Check if MongoDB is running
- For Atlas, check IP whitelist

**AI not responding?**
- Check if Ollama is running locally
- AI service will use demo mode if Ollama unavailable
- Check AI service logs

**Voice not working?**
- Use Chrome or Edge browser
- Allow microphone permissions
- Make sure you're on HTTPS in production

**Authentication problems?**
- Check JWT secret in .env
- Clear browser cache
- Verify backend is running

### Getting Help

If you run into issues:
1. Check the console logs for error messages
2. Make sure all environment variables are set
3. Try running locally first
4. Check this documentation
5. Open an issue on GitHub

## Development

### Adding New Features

1. **Frontend changes**: Edit files in `frontend/src/`
2. **Backend changes**: Edit files in `backend/`
3. **AI changes**: Edit files in `ai-service/`
4. **Database changes**: Update models in `backend/models/`

### Code Style

We tried to keep things simple and readable:
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Use consistent indentation (2 spaces)

### Testing

Right now we don't have automated tests, but we test manually:
- Try different user flows
- Test with different browsers
- Check error handling
- Verify API responses

## Why We Built This

We wanted to create something that:
- Helps farmers make better decisions
- Doesn't cost money to run
- Works in local languages
- Is easy to use
- Can be deployed anywhere

The AI part was tricky because most AI services cost money. That's why we used Ollama - it runs AI models locally for free.

## What's Next

Some ideas for future improvements:
- Mobile app version
- Offline capability
- More AI models
- Better analytics
- Integration with IoT sensors
- Blockchain for supply chain

## Contributing

Want to help improve this? Great!
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test everything works
5. Submit a pull request

## License

This project is MIT licensed - feel free to use it for your own projects.

## Contact

If you have questions or suggestions, feel free to open an issue on GitHub.

---

Thanks for checking out our project! We hope it helps farmers make better decisions. 🌾

**Last updated**: Sep 2025
