const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const NodeCache = require('node-cache');

class AIService {
  constructor() {
    // Ollama configuration
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    this.ollamaModel = process.env.OLLAMA_MODEL || 'llama2';
    
    this.cache = new NodeCache({
      stdTTL: parseInt(process.env.CACHE_TTL) || 3600,
      checkperiod: parseInt(process.env.CACHE_CHECK_PERIOD) || 600
    });
    
    this.vectorDB = [];
    this.knowledgeBasePath = process.env.KNOWLEDGE_BASE_PATH || './data/crop_knowledge';
    this.vectorDBPath = process.env.VECTOR_DB_PATH || './data/vector_db';
    
    this.initializeVectorDB();
  }

  async initializeVectorDB() {
    try {
      await fs.ensureDir(this.vectorDBPath);
      await fs.ensureDir(this.knowledgeBasePath);
      
      const vectorDBFile = path.join(this.vectorDBPath, 'embeddings.json');
      
      if (await fs.pathExists(vectorDBFile)) {
        const data = await fs.readJson(vectorDBFile);
        this.vectorDB = data;
        console.log(`📚 Loaded ${this.vectorDB.length} embeddings from vector database`);
      } else {
        console.log('🔄 Vector database not found. Run setup-embeddings to create it.');
      }
    } catch (error) {
      console.error('❌ Error initializing vector database:', error);
    }
  }

  async generateEmbedding(text) {
    try {
      // For Ollama, we'll use a simple text-based similarity approach
      // This is a simplified version - in production you might want to use
      // a separate embedding model or service
      const words = text.toLowerCase().split(/\s+/);
      const wordCounts = {};
      
      words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });
      
      // Create a simple vector representation
      const allWords = Object.keys(wordCounts);
      const vector = allWords.map(word => wordCounts[word] / words.length);
      
      return vector;
    } catch (error) {
      console.error('❌ Error generating embedding:', error);
      throw error;
    }
  }

  calculateCosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
      return 0;
    }
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    
    if (normA === 0 || normB === 0) {
      return 0;
    }
    
    return dotProduct / (normA * normB);
  }

  async findSimilarDocuments(query, limit = 5) {
    try {
      const queryEmbedding = await this.generateEmbedding(query);
      const similarities = [];
      
      for (const doc of this.vectorDB) {
        const similarity = this.calculateCosineSimilarity(queryEmbedding, doc.embedding);
        similarities.push({
          ...doc,
          similarity
        });
      }
      
      // Sort by similarity and return top results
      similarities.sort((a, b) => b.similarity - a.similarity);
      
      const threshold = parseFloat(process.env.SIMILARITY_THRESHOLD) || 0.7;
      return similarities
        .filter(doc => doc.similarity >= threshold)
        .slice(0, limit);
        
    } catch (error) {
      console.error('❌ Error finding similar documents:', error);
      return [];
    }
  }

  async generateRecommendation(context, farmerData, weatherData, marketData, language = 'English') {
    try {
      const cacheKey = `recommendation_${JSON.stringify(context)}_${JSON.stringify(farmerData)}_${language}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached) {
        return cached;
      }

      // Check if Ollama is available
      if (!await this.isOllamaAvailable()) {
        return this.getDemoRecommendation(context, farmerData, weatherData, marketData, language);
      }

      // Build context from similar documents
      const similarDocs = await this.findSimilarDocuments(
        `${context.soilType} ${context.season} ${context.region} crops`
      );
      
      const relevantContext = similarDocs
        .map(doc => doc.content)
        .join('\n\n')
        .slice(0, parseInt(process.env.MAX_CONTEXT_LENGTH) || 4000);

      const languageInstructions = this.getLanguageInstructions(language);

      const systemPrompt = `You are an expert agricultural advisor helping farmers choose the best crops for their land. ${languageInstructions} 

Use the following information to provide personalized recommendations:

FARMER INFORMATION:
- Location: ${farmerData.location.state}, ${farmerData.location.district}
- Soil Type: ${farmerData.farmDetails.soilType}
- Land Area: ${farmerData.farmDetails.totalLandArea} acres
- Irrigated Area: ${farmerData.farmDetails.irrigatedArea} acres
- Budget: ${context.budget || 'Not specified'}

CURRENT CONDITIONS:
- Season: ${context.season}
- Weather: ${weatherData ? JSON.stringify(weatherData) : 'Not available'}
- Market Trends: ${marketData ? JSON.stringify(marketData) : 'Not available'}

CROP KNOWLEDGE BASE:
${relevantContext}

Provide recommendations in the following JSON format:
{
  "recommendations": [
    {
      "cropName": "Crop Name",
      "confidence": 0.85,
      "reasoning": "Detailed explanation",
      "estimatedYield": 2500,
      "estimatedProfit": 45000,
      "riskFactors": ["Risk 1", "Risk 2"],
      "suggestions": ["Suggestion 1", "Suggestion 2"],
      "cultivationTips": ["Tip 1", "Tip 2"]
    }
  ],
  "summary": "Overall recommendation summary",
  "marketInsights": "Current market analysis",
  "weatherConsiderations": "Weather-related advice"
}

Be specific, practical, and consider the farmer's local conditions.`;

      const userPrompt = `Based on the above information, provide crop recommendations for this farmer. Focus on crops that are suitable for their soil type, season, and region. Consider market conditions and weather patterns.`;

      const response = await this.callOllama(systemPrompt + '\n\n' + userPrompt);
      
      // Try to parse JSON response
      let recommendation;
      try {
        recommendation = JSON.parse(response);
      } catch (parseError) {
        // If JSON parsing fails, create a structured response
        recommendation = {
          recommendations: [{
            cropName: 'Rice',
            confidence: 0.8,
            reasoning: content,
            estimatedYield: 2500,
            estimatedProfit: 45000,
            riskFactors: ['Weather dependency'],
            suggestions: ['Ensure proper irrigation'],
            cultivationTips: ['Follow recommended spacing']
          }],
          summary: content,
          marketInsights: 'Consider local market conditions',
          weatherConsiderations: 'Monitor weather forecasts'
        };
      }

      // Cache the result
      this.cache.set(cacheKey, recommendation);
      
      return recommendation;
      
    } catch (error) {
      console.error('❌ Error generating recommendation:', error);
      throw error;
    }
  }

  async chatResponse(message, sessionContext, language = 'English') {
    try {
      // Check if Ollama is available
      if (!await this.isOllamaAvailable()) {
        return this.getDemoChatResponse(message, language);
      }

      const languageInstructions = this.getLanguageInstructions(language);
      
      const systemPrompt = `You are an AI agricultural assistant helping farmers with crop-related questions. ${languageInstructions}

You have access to:
- Crop knowledge base
- Weather information
- Market data
- Farmer's farm details

Be helpful, informative, and practical. If you don't know something, say so rather than making up information.

Current session context:
${JSON.stringify(sessionContext, null, 2)}

Respond in a conversational, helpful manner.`;

      const response = await this.callOllama(systemPrompt + '\n\nUser: ' + message);
      
      return response;
      
    } catch (error) {
      console.error('❌ Error generating chat response:', error);
      throw error;
    }
  }

  async addToKnowledgeBase(content, metadata = {}) {
    try {
      const embedding = await this.generateEmbedding(content);
      
      const document = {
        id: Date.now().toString(),
        content,
        embedding,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString()
        }
      };
      
      this.vectorDB.push(document);
      
      // Save to file
      await fs.writeJson(
        path.join(this.vectorDBPath, 'embeddings.json'),
        this.vectorDB,
        { spaces: 2 }
      );
      
      console.log(`✅ Added document to knowledge base: ${document.id}`);
      return document;
      
    } catch (error) {
      console.error('❌ Error adding to knowledge base:', error);
      throw error;
    }
  }

  async isOllamaAvailable() {
    try {
      const response = await axios.get(`${this.ollamaUrl}/api/tags`, { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.log('⚠️ Ollama not available, falling back to demo mode');
      return false;
    }
  }

  async callOllama(prompt) {
    try {
      const response = await axios.post(`${this.ollamaUrl}/api/generate`, {
        model: this.ollamaModel,
        prompt: prompt,
        stream: false,
        options: {
          temperature: parseFloat(process.env.OLLAMA_TEMPERATURE) || 0.7,
          top_p: parseFloat(process.env.OLLAMA_TOP_P) || 0.9,
          max_tokens: parseInt(process.env.OLLAMA_MAX_TOKENS) || 1000
        }
      }, {
        timeout: 30000 // 30 seconds timeout
      });

      return response.data.response;
    } catch (error) {
      console.error('❌ Error calling Ollama:', error.message);
      throw error;
    }
  }

  getLanguageInstructions(language) {
    const instructions = {
      'English': 'Respond in English.',
      'Hindi': 'Respond in Hindi (हिंदी). Use Devanagari script.',
      'Telugu': 'Respond in Telugu (తెలుగు). Use Telugu script.',
      'Tamil': 'Respond in Tamil (தமிழ்). Use Tamil script.'
    };
    
    return instructions[language] || instructions['English'];
  }

  getDemoRecommendation(context, farmerData, weatherData, marketData, language) {
    const demoRecommendations = {
      'English': {
        recommendations: [
          {
            cropName: 'Rice',
            suitability: 'High',
            reason: 'Perfect for your clay soil and monsoon season',
            expectedYield: '4-5 tons per acre',
            marketPrice: '₹2,500 per quintal',
            cultivationTips: ['Use certified seeds', 'Maintain proper water level', 'Apply balanced fertilizers']
          },
          {
            cropName: 'Wheat',
            suitability: 'Medium',
            reason: 'Good for winter season in your region',
            expectedYield: '3-4 tons per acre',
            marketPrice: '₹2,200 per quintal',
            cultivationTips: ['Prepare soil well', 'Use proper spacing', 'Control weeds']
          }
        ],
        summary: 'Based on your soil type and location, rice and wheat are excellent choices for your farm.',
        marketInsights: 'Current market prices are favorable for both crops.',
        weatherConsiderations: 'Monitor rainfall patterns and adjust irrigation accordingly.'
      },
      'Hindi': {
        recommendations: [
          {
            cropName: 'चावल',
            suitability: 'उच्च',
            reason: 'आपकी मिट्टी और मानसून के लिए उपयुक्त',
            expectedYield: 'प्रति एकड़ 4-5 टन',
            marketPrice: 'प्रति क्विंटल ₹2,500',
            cultivationTips: ['प्रमाणित बीज का उपयोग करें', 'उचित जल स्तर बनाए रखें', 'संतुलित उर्वरक डालें']
          }
        ],
        summary: 'आपकी मिट्टी और स्थान के आधार पर, चावल आपके खेत के लिए उत्कृष्ट विकल्प है।',
        marketInsights: 'वर्तमान बाजार मूल्य दोनों फसलों के लिए अनुकूल हैं।',
        weatherConsiderations: 'वर्षा पैटर्न की निगरानी करें और सिंचाई को तदनुसार समायोजित करें।'
      }
    };

    return demoRecommendations[language] || demoRecommendations['English'];
  }

  getDemoChatResponse(message, language) {
    const demoResponses = {
      'English': [
        "Hello! I'm your AI farming assistant. I can help you with crop recommendations, farming advice, and agricultural questions. What would you like to know?",
        "Based on your farm details, I recommend focusing on crops suitable for your soil type and climate. Would you like specific recommendations?",
        "I can help you with crop selection, farming techniques, pest management, and market information. What specific area interests you?",
        "For better crop yields, consider factors like soil preparation, seed selection, irrigation, and timing. What crops are you planning to grow?",
        "I'm here to help with all your farming questions. Feel free to ask about crop varieties, farming methods, or any agricultural concerns."
      ],
      'Hindi': [
        "नमस्ते! मैं आपका AI कृषि सहायक हूं। मैं आपकी फसल सिफारिशों, कृषि सलाह और कृषि प्रश्नों में मदद कर सकता हूं। आप क्या जानना चाहते हैं?",
        "आपके खेत के विवरण के आधार पर, मैं आपकी मिट्टी और जलवायु के लिए उपयुक्त फसलों पर ध्यान केंद्रित करने की सलाह देता हूं। क्या आप विशिष्ट सिफारिशें चाहते हैं?",
        "मैं फसल चयन, कृषि तकनीक, कीट प्रबंधन और बाजार की जानकारी में आपकी मदद कर सकता हूं। कौन सा क्षेत्र आपको रुचिकर लगता है?",
        "बेहतर फसल उत्पादन के लिए मिट्टी की तैयारी, बीज चयन, सिंचाई और समय जैसे कारकों पर विचार करें। आप कौन सी फसलें उगाने की योजना बना रहे हैं?",
        "मैं आपके सभी कृषि प्रश्नों में मदद के लिए यहां हूं। फसल किस्मों, कृषि विधियों या किसी भी कृषि संबंधी चिंताओं के बारे में पूछने में संकोच न करें।"
      ]
    };

    const responses = demoResponses[language] || demoResponses['English'];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }

  getStats() {
    return {
      vectorDBSize: this.vectorDB.length,
      cacheSize: this.cache.keys().length,
      cacheStats: this.cache.getStats()
    };
  }
}

module.exports = AIService;


