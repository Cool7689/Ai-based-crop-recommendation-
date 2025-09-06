#!/bin/bash

echo "🧪 Testing Ollama Integration for AI Crop Recommendations"
echo "========================================================"

# Check if Ollama is running
echo "🔍 Checking if Ollama is running..."
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "✅ Ollama is running"
else
    echo "❌ Ollama is not running. Starting Ollama..."
    ollama serve &
    sleep 10
fi

# Check if Llama2 model is available
echo "🔍 Checking if Llama2 model is available..."
if ollama list | grep -q "llama2"; then
    echo "✅ Llama2 model is available"
else
    echo "❌ Llama2 model not found. Downloading..."
    ollama pull llama2
fi

# Test AI Service
echo "🔍 Testing AI Service..."
cd ai-service

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Test the AI service
echo "🧪 Testing crop recommendation..."
node -e "
const AIService = require('./services/aiService');
const ai = new AIService();

async function test() {
    try {
        console.log('Testing Ollama integration...');
        
        const context = {
            soilType: 'clay',
            season: 'monsoon',
            region: 'north'
        };
        
        const farmerData = {
            location: { state: 'Punjab', district: 'Ludhiana' },
            farmDetails: { soilType: 'clay', totalLandArea: 5, irrigatedArea: 3 }
        };
        
        const result = await ai.generateRecommendation(context, farmerData, null, null, 'English');
        console.log('✅ AI Service working!');
        console.log('Sample recommendation:', JSON.stringify(result, null, 2));
        
    } catch (error) {
        console.log('❌ AI Service error:', error.message);
    }
}

test();
"

echo ""
echo "🎉 Ollama integration test complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the AI service: cd ai-service && npm start"
echo "2. Start the backend: cd backend && npm start"
echo "3. Start the frontend: cd frontend && npm start"
echo ""
echo "🌐 Access the app at: http://localhost:3000"
