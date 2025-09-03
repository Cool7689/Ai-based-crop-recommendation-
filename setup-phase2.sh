#!/bin/bash

echo "🚀 Welcome to Crop Recommendation System - Phase 2 Setup!"
echo "========================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Setup AI Service
echo ""
echo "🤖 Setting up AI Service..."
cd ai-service

if [ ! -f .env ]; then
    echo "🔧 Creating environment file for AI service..."
    cp env.example .env
    echo "⚠️  Please update ai-service/.env with your OpenAI API key"
fi

echo "📦 Installing AI service dependencies..."
npm install

echo "✅ AI Service setup completed!"

# Setup Frontend
echo ""
echo "🎨 Setting up Frontend..."
cd ../frontend

echo "📦 Installing frontend dependencies..."
npm install

echo "✅ Frontend setup completed!"

# Setup Backend (if not already done)
echo ""
echo "🔧 Checking Backend setup..."
cd ../backend

if [ ! -f .env ]; then
    echo "🔧 Creating environment file for backend..."
    cp env.example .env
    echo "⚠️  Please update backend/.env with your configuration"
fi

if [ ! -d node_modules ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

echo "✅ Backend setup completed!"

# Create data directories
echo ""
echo "📁 Creating data directories..."
cd ..
mkdir -p ai-service/data/vector_db
mkdir -p ai-service/data/crop_knowledge

echo "✅ Data directories created!"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Update environment files with your API keys:"
echo "   - backend/.env"
echo "   - ai-service/.env"
echo ""
echo "2. Start MongoDB:"
echo "   mongod"
echo ""
echo "3. Start the services (in separate terminals):"
echo "   # Terminal 1 - Backend"
echo "   cd backend && npm run dev"
echo ""
echo "   # Terminal 2 - AI Service"
echo "   cd ai-service && npm run dev"
echo ""
echo "   # Terminal 3 - Frontend"
echo "   cd frontend && npm start"
echo ""
echo "4. Seed the crop knowledge base:"
echo "   cd ai-service && npm run seed-crop-data"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   AI Service: http://localhost:5001"
echo ""
echo "🚀 Ready for Phase 2: AI Integration!"


