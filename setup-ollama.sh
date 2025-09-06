#!/bin/bash

echo "🚀 Setting up Ollama for Free AI Crop Recommendations"
echo "=================================================="

# Check if Ollama is already installed
if command -v ollama &> /dev/null; then
    echo "✅ Ollama is already installed"
else
    echo "📥 Installing Ollama..."
    curl -fsSL https://ollama.ai/install.sh | sh
fi

# Start Ollama service
echo "🔄 Starting Ollama service..."
ollama serve &
OLLAMA_PID=$!

# Wait for Ollama to start
echo "⏳ Waiting for Ollama to start..."
sleep 10

# Download Llama2 model (free and good for crop recommendations)
echo "📥 Downloading Llama2 model (this may take a few minutes)..."
ollama pull llama2

# Download Mistral model (alternative, smaller and faster)
echo "📥 Downloading Mistral model (alternative)..."
ollama pull mistral

# Test the installation
echo "🧪 Testing Ollama installation..."
if ollama list | grep -q "llama2"; then
    echo "✅ Llama2 model installed successfully"
else
    echo "❌ Failed to install Llama2 model"
    exit 1
fi

echo ""
echo "🎉 Ollama setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy ai-service/env.example to ai-service/.env"
echo "2. Run: cd ai-service && npm install"
echo "3. Run: npm start"
echo ""
echo "🔧 Configuration:"
echo "- Ollama URL: http://localhost:11434"
echo "- Default Model: llama2"
echo "- Alternative Model: mistral"
echo ""
echo "💡 Tips:"
echo "- Ollama runs locally on your machine"
echo "- No API keys required"
echo "- Completely free to use"
echo "- Models are downloaded once and cached locally"
echo ""
echo "🛑 To stop Ollama: kill $OLLAMA_PID"
echo "🔄 To restart Ollama: ollama serve"
