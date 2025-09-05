#!/bin/bash

# AI-Based Crop Recommendation System - Complete Setup Script
# This script sets up the entire system with all features including voice and multi-language support

echo "🌾 AI-Based Crop Recommendation System - Complete Setup"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js $(node -v) is installed"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    print_warning "MongoDB is not installed. Please install MongoDB first."
    print_info "Visit: https://docs.mongodb.com/manual/installation/"
    exit 1
fi

print_status "MongoDB is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "npm $(npm -v) is installed"

echo ""
print_info "Setting up Backend Service..."

# Setup Backend
cd backend

# Install dependencies
print_info "Installing backend dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_status "Backend dependencies installed successfully"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_info "Creating backend .env file..."
    cp .env.example .env
    print_warning "Please update backend/.env with your actual API keys and configuration"
    print_info "Required: MONGODB_URI, JWT_SECRET, OPENAI_API_KEY, WEATHER_API_KEY"
else
    print_status "Backend .env file already exists"
fi

cd ..

echo ""
print_info "Setting up AI Service..."

# Setup AI Service
cd ai-service

# Install dependencies
print_info "Installing AI service dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_status "AI service dependencies installed successfully"
else
    print_error "Failed to install AI service dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_info "Creating AI service .env file..."
    cp .env.example .env
    print_warning "Please update ai-service/.env with your OpenAI API key"
    print_info "Required: OPENAI_API_KEY"
else
    print_status "AI service .env file already exists"
fi

# Create data directories
mkdir -p data/vector_db
mkdir -p data/crop_knowledge
print_status "AI service data directories created"

cd ..

echo ""
print_info "Setting up Frontend Service..."

# Setup Frontend
cd frontend

# Install dependencies
print_info "Installing frontend dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_status "Frontend dependencies installed successfully"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_info "Creating frontend .env file..."
    echo "REACT_APP_API_URL=http://localhost:5000" > .env
    print_status "Frontend .env file created"
else
    print_status "Frontend .env file already exists"
fi

cd ..

echo ""
print_info "Setting up project structure..."

# Create additional directories if they don't exist
mkdir -p docs
mkdir -p database
mkdir -p docker

print_status "Project structure created"

echo ""
print_info "🎉 Setup Complete! All services are ready."
echo ""
print_info "Next Steps:"
echo "1. Update environment variables in:"
echo "   - backend/.env"
echo "   - ai-service/.env"
echo "   - frontend/.env"
echo ""
echo "2. Start MongoDB service:"
echo "   sudo systemctl start mongod"
echo ""
echo "3. Start all services:"
echo "   # Terminal 1 - Backend"
echo "   cd backend && npm start"
echo ""
echo "   # Terminal 2 - AI Service"
echo "   cd ai-service && npm start"
echo ""
echo "   # Terminal 3 - Frontend"
echo "   cd frontend && npm start"
echo ""
echo "4. Seed AI knowledge base (optional):"
echo "   cd ai-service && node scripts/seed-crop-data.js"
echo ""
print_info "🌐 Access the application at: http://localhost:3000"
echo ""
print_info "📚 Features Available:"
echo "   ✅ AI-powered crop recommendations"
echo "   ✅ ChatGPT-style chat interface"
echo "   ✅ Voice input/output support"
echo "   ✅ Multi-language support (English, Hindi, Telugu, Tamil)"
echo "   ✅ Real-time weather data"
echo "   ✅ Market price trends"
echo "   ✅ User authentication"
echo "   ✅ Mobile-responsive design"
echo ""
print_status "Setup completed successfully! 🚀"
