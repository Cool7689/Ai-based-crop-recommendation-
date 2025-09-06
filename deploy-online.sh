#!/bin/bash

echo "🚀 AI Crop Recommendation System - Free Online Deployment"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo ""
print_info "This script will help you deploy your AI Crop Recommendation System online for FREE!"
echo ""
print_info "Deployment Plan:"
echo "  🌐 Frontend → Vercel (Free)"
echo "  🔧 Backend → Railway (Free tier)"
echo "  🤖 AI Service → Railway (Free tier)"
echo "  🗄️  Database → MongoDB Atlas (Free)"
echo "  🎯 AI Mode → Demo (No API keys needed)"
echo ""

# Check if required tools are installed
print_info "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
print_status "Node.js $(node -v) is installed"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi
print_status "npm $(npm -v) is installed"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
    if [ $? -eq 0 ]; then
        print_status "Vercel CLI installed"
    else
        print_error "Failed to install Vercel CLI"
        exit 1
    fi
else
    print_status "Vercel CLI is installed"
fi

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    print_warning "Railway CLI not found. Installing..."
    npm install -g @railway/cli
    if [ $? -eq 0 ]; then
        print_status "Railway CLI installed"
    else
        print_error "Failed to install Railway CLI"
        exit 1
    fi
else
    print_status "Railway CLI is installed"
fi

echo ""
print_info "🎯 Ready to deploy! Here's what we'll do:"
echo ""
echo "1. 📦 Prepare all services for deployment"
echo "2. 🌐 Deploy Frontend to Vercel"
echo "3. 🔧 Deploy Backend to Railway"
echo "4. 🤖 Deploy AI Service to Railway"
echo "5. 🗄️  Set up MongoDB Atlas (you'll do this manually)"
echo "6. 🔗 Connect all services"
echo "7. 🧪 Test the deployed system"
echo ""

read -p "Do you want to proceed? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Deployment cancelled. Run this script again when ready!"
    exit 0
fi

echo ""
print_info "🚀 Starting deployment process..."

# Step 1: Prepare Frontend
print_info "Step 1: Preparing Frontend for Vercel deployment..."
cd frontend

# Create production build
print_info "Creating production build..."
npm run build
if [ $? -eq 0 ]; then
    print_status "Frontend build successful"
else
    print_error "Frontend build failed"
    exit 1
fi

cd ..

# Step 2: Prepare Backend
print_info "Step 2: Preparing Backend for Railway deployment..."
cd backend

# Install production dependencies
print_info "Installing production dependencies..."
npm ci --only=production
if [ $? -eq 0 ]; then
    print_status "Backend dependencies installed"
else
    print_error "Backend dependencies installation failed"
    exit 1
fi

cd ..

# Step 3: Prepare AI Service
print_info "Step 3: Preparing AI Service for Railway deployment..."
cd ai-service

# Install production dependencies
print_info "Installing production dependencies..."
npm ci --only=production
if [ $? -eq 0 ]; then
    print_status "AI Service dependencies installed"
else
    print_error "AI Service dependencies installation failed"
    exit 1
fi

cd ..

echo ""
print_status "🎉 All services prepared for deployment!"
echo ""
print_info "Next steps (manual):"
echo ""
echo "1. 🌐 Deploy Frontend to Vercel:"
echo "   cd frontend && vercel login && vercel --prod"
echo ""
echo "2. 🔧 Deploy Backend to Railway:"
echo "   cd backend && railway login && railway init && railway up"
echo ""
echo "3. 🤖 Deploy AI Service to Railway:"
echo "   cd ai-service && railway init && railway up"
echo ""
echo "4. 🗄️  Set up MongoDB Atlas:"
echo "   - Go to https://www.mongodb.com/atlas"
echo "   - Create free account"
echo "   - Create cluster"
echo "   - Get connection string"
echo ""
echo "5. 🔗 Update environment variables in all services"
echo ""
echo "6. 🧪 Test your deployed system!"
echo ""
print_info "📚 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
print_status "Deployment preparation complete! 🚀"
