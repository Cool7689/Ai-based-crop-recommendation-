#!/bin/bash

# 🌾 Crop Recommendation System - Phase 1 Setup Script
# This script helps set up the backend environment

echo "🚀 Welcome to Crop Recommendation System Setup!"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    echo "   Please upgrade Node.js."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH."
    echo "   Please install MongoDB:"
    echo "   Ubuntu/Debian: sudo apt install mongodb"
    echo "   macOS: brew install mongodb"
    echo "   Windows: Download from mongodb.com"
    echo ""
    echo "   After installation, make sure MongoDB service is running:"
    echo "   sudo systemctl start mongodb"
    echo ""
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ MongoDB found: $(mongod --version | head -n1)"
fi

# Navigate to backend directory
cd backend

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "🔧 Creating environment file..."
    cp env.example .env
    echo "✅ Environment file created (.env)"
    echo "   Please edit .env file with your configuration"
else
    echo "✅ Environment file already exists (.env)"
fi

# Check if MongoDB is running
echo ""
echo "🔍 Checking MongoDB connection..."
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running"
        echo "   Start MongoDB with: sudo systemctl start mongodb"
        echo "   Or run: mongod"
    fi
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit .env file with your configuration"
echo "2. Start MongoDB if not running: sudo systemctl start mongodb"
echo "3. Start the server: npm run dev"
echo "4. Test the API: node test-api.js"
echo ""
echo "📚 Documentation:"
echo "- Quick Start Guide: docs/quick-start-guide.md"
echo "- Phase 1 Details: docs/phase1-backend-setup.md"
echo "- API Testing: node test-api.js"
echo ""
echo "🚀 Ready for Phase 2: AI Integration!"
