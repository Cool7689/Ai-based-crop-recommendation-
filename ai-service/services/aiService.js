const OpenAI = require('openai');
const fs = require('fs-extra');
const path = require('path');
const NodeCache = require('node-cache');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
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
      const response = await this.openai.embeddings.create({
        model: process.env.EMBEDDING_MODEL || 'text-embedding-ada-002',
        input: text
      });
      
      return response.data[0].embedding;
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

  async generateRecommendation(context, farmerData, weatherData, marketData) {
    try {
      const cacheKey = `recommendation_${JSON.stringify(context)}_${JSON.stringify(farmerData)}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached) {
        return cached;
      }

      // Build context from similar documents
      const similarDocs = await this.findSimilarDocuments(
        `${context.soilType} ${context.season} ${context.region} crops`
      );
      
      const relevantContext = similarDocs
        .map(doc => doc.content)
        .join('\n\n')
        .slice(0, parseInt(process.env.MAX_CONTEXT_LENGTH) || 4000);

      const systemPrompt = `You are an expert agricultural advisor helping farmers choose the best crops for their land. 

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

      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
        top_p: parseFloat(process.env.OPENAI_TOP_P) || 0.9
      });

      const content = response.choices[0].message.content;
      
      // Try to parse JSON response
      let recommendation;
      try {
        recommendation = JSON.parse(content);
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

  async chatResponse(message, sessionContext) {
    try {
      const systemPrompt = `You are an AI agricultural assistant helping farmers with crop-related questions. 

You have access to:
- Crop knowledge base
- Weather information
- Market data
- Farmer's farm details

Be helpful, informative, and practical. If you don't know something, say so rather than making up information.

Current session context:
${JSON.stringify(sessionContext, null, 2)}

Respond in a conversational, helpful manner.`;

      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7
      });

      return response.choices[0].message.content;
      
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

  getStats() {
    return {
      vectorDBSize: this.vectorDB.length,
      cacheSize: this.cache.keys().length,
      cacheStats: this.cache.getStats()
    };
  }
}

module.exports = AIService;


