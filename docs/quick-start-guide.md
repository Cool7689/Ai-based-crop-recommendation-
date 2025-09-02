# Quick Start Guide for Junior Developers

## Welcome to the Crop Recommendation System!

This guide will help you understand and run the Phase 1 backend setup step by step.

## What We Built in Phase 1

### Project Overview
We created a **Node.js backend API** for an AI-based crop recommendation system that helps farmers get personalized advice.

### What's Included
- **User Management**: Farmer registration and authentication
- **Chat System**: Conversation management for AI interactions
- **Crop Database**: Comprehensive crop information
- **Weather API**: Weather data endpoints (mock data for now)
- **Market API**: Market prices and trends (mock data for now)
- **Security**: JWT authentication, rate limiting, CORS

## Setup Instructions

### Step 1: Prerequisites
Make sure you have installed:
```bash
# Check Node.js version (should be 18+)
node --version

# Check if MongoDB is installed
mongod --version

# If MongoDB is not installed, install it:
# Ubuntu/Debian: sudo apt install mongodb
# macOS: brew install mongodb
# Windows: Download from mongodb.com
```

### Step 2: Clone and Setup
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env
```

### Step 3: Configure Environment
Edit the `.env` file:
```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/crop_recommendation

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
```

### Step 4: Start MongoDB
```bash
# Start MongoDB service
sudo systemctl start mongodb

# Or if running locally
mongod
```

### Step 5: Start the Server
```bash
# Start development server
npm run dev

# You should see:
# 🚀 Crop Recommendation API running on port 5000
# 📊 Health check: http://localhost:5000/health
# 🌍 Environment: development
```

### Step 6: Test the API
```bash
# Run the test script
node test-api.js

# This will test all endpoints and show results
```

## Understanding the Tests

The test script (`test-api.js`) tests these key features:

### 1. **Health Check**
- Tests if the server is running
- Endpoint: `GET /health`

### 2. **Farmer Registration**
- Creates a new farmer account
- Endpoint: `POST /api/farmers/register`

### 3. **Farmer Login**
- Authenticates farmer and gets JWT token
- Endpoint: `POST /api/farmers/login`

### 4. **Chat Session**
- Creates a new chat conversation
- Endpoint: `POST /api/chat/session`

### 5. **Send Message**
- Sends a message in the chat
- Endpoint: `POST /api/chat/message`

### 6. **Crop Search**
- Searches for crops by name
- Endpoint: `GET /api/crops/search/rice`

### 7. **Weather Data**
- Gets weather information (mock data)
- Endpoint: `GET /api/weather/current/Mumbai`

### 8. **Market Data**
- Gets crop prices (mock data)
- Endpoint: `GET /api/market/prices/rice`

## Key Concepts to Understand

### Authentication Flow
1. **Registration**: Farmer creates account → gets JWT token
2. **Login**: Farmer authenticates → gets new JWT token
3. **Protected Routes**: Include `Authorization: Bearer <token>` header

### Chat System
1. **Create Session**: Start new conversation
2. **Send Message**: User sends message → AI responds
3. **Get History**: Retrieve conversation history

### Database Models
- **Farmer**: Stores user information and farm details
- **ChatSession**: Stores conversation history and AI recommendations
- **Crop**: Stores comprehensive crop information

## Exploring the Code

### Key Files to Study:

1. **`server.js`** - Main application entry point
2. **`models/Farmer.js`** - Database schema for farmers
3. **`controllers/farmerController.js`** - Business logic for farmers
4. **`routes/farmers.js`** - API endpoints for farmer management
5. **`middleware/auth.js`** - JWT authentication middleware

### Code Structure Pattern:
```
Route → Controller → Model → Database
```

## What's Next (Phase 2)

In Phase 2, we'll add:
- **AI Integration**: OpenAI GPT for intelligent responses
- **Real Weather Data**: Integration with weather APIs
- **Real Market Data**: Integration with market APIs
- **Smart Recommendations**: AI-powered crop suggestions

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   ```bash
   # Make sure MongoDB is running
   sudo systemctl status mongodb
   ```

2. **Port Already in Use**
   ```bash
   # Change port in .env file
   PORT=5001
   ```

3. **Module Not Found**
   ```bash
   # Reinstall dependencies
   rm -rf node_modules
   npm install
   ```

4. **JWT Token Issues**
   ```bash
   # Make sure JWT_SECRET is set in .env
   # Generate a new secret if needed
   ```

## Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB with Mongoose](https://mongoosejs.com/)
- [JWT Authentication](https://jwt.io/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

## Congratulations!

You've successfully set up the Phase 1 backend! You now have:
- A working API server
- User authentication system
- Database models and relationships
- Chat system foundation
- Security features

**Ready for Phase 2: AI Integration!**

---

**Need Help?** Check the detailed documentation in `docs/phase1-backend-setup.md`
