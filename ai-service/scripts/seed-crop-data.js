const AIService = require('../services/aiService');
const fs = require('fs-extra');
const path = require('path');

const cropKnowledge = [
  {
    content: `Rice (Oryza sativa) is a staple food crop that thrives in warm, humid climates. It requires clay or loamy soil with good water retention capacity. Rice grows best in temperatures between 20-35°C and needs 100-200cm of rainfall annually. It's primarily grown in Kharif season (June-September) and requires continuous water supply. Rice cultivation is suitable for regions with high humidity and moderate to heavy rainfall. The crop takes 120-150 days to mature and yields 2-3 tons per acre under good conditions. Rice is highly profitable with strong domestic and export demand.`,
    metadata: {
      crop: 'Rice',
      category: 'Cereals',
      season: 'Kharif',
      soilType: ['Clay', 'Loamy'],
      regions: ['Punjab', 'Haryana', 'Uttar Pradesh', 'West Bengal', 'Tamil Nadu']
    }
  },
  {
    content: `Wheat (Triticum aestivum) is a winter crop that grows well in cool, dry climates. It prefers loamy or clay soil with good drainage. Wheat requires temperatures between 15-25°C and moderate rainfall (50-100cm). It's grown in Rabi season (October-March) and is drought-tolerant compared to rice. Wheat cultivation is ideal for regions with cold winters and moderate rainfall. The crop takes 110-130 days to mature and yields 2.5-3.5 tons per acre. Wheat has stable market demand and good profitability.`,
    metadata: {
      crop: 'Wheat',
      category: 'Cereals',
      season: 'Rabi',
      soilType: ['Loamy', 'Clay'],
      regions: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan']
    }
  },
  {
    content: `Cotton (Gossypium hirsutum) is a fiber crop that requires warm, dry climates. It grows well in black soil or alluvial soil with good drainage. Cotton needs temperatures between 20-30°C and moderate rainfall (60-120cm). It's grown in Kharif season and requires careful pest management. Cotton cultivation is suitable for regions with hot summers and moderate rainfall. The crop takes 150-180 days to mature and yields 1.5-2.5 quintals per acre. Cotton has good export potential but market prices can be volatile.`,
    metadata: {
      crop: 'Cotton',
      category: 'Fibre',
      season: 'Kharif',
      soilType: ['Black', 'Alluvial'],
      regions: ['Maharashtra', 'Gujarat', 'Madhya Pradesh', 'Karnataka', 'Telangana']
    }
  },
  {
    content: `Sugarcane (Saccharum officinarum) is a commercial crop that requires tropical or subtropical climates. It grows best in alluvial or loamy soil with good water retention. Sugarcane needs temperatures between 20-35°C and high rainfall (150-200cm). It's grown year-round but peaks in Zaid season. Sugarcane cultivation requires intensive irrigation and is suitable for regions with high rainfall or good irrigation facilities. The crop takes 12-18 months to mature and yields 60-80 tons per acre. Sugarcane has stable demand from sugar industry.`,
    metadata: {
      crop: 'Sugarcane',
      category: 'Commercial',
      season: 'Zaid',
      soilType: ['Alluvial', 'Loamy'],
      regions: ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh']
    }
  },
  {
    content: `Pulses (various species) are protein-rich crops that grow in diverse climates. They prefer well-drained loamy soil and moderate temperatures (20-30°C). Pulses require moderate rainfall (40-80cm) and are drought-tolerant. They're grown in both Kharif and Rabi seasons depending on the variety. Pulse cultivation is suitable for regions with moderate rainfall and good drainage. Different pulses take 90-150 days to mature and yield 0.8-1.5 tons per acre. Pulses have good domestic demand and are essential for crop rotation.`,
    metadata: {
      crop: 'Pulses',
      category: 'Pulses',
      season: ['Kharif', 'Rabi'],
      soilType: ['Loamy', 'Sandy'],
      regions: ['Madhya Pradesh', 'Rajasthan', 'Maharashtra', 'Uttar Pradesh', 'Karnataka']
    }
  },
  {
    content: `Oilseeds (various species) are important commercial crops grown for oil extraction. They prefer well-drained soil and moderate temperatures (20-30°C). Oilseeds require moderate rainfall (50-100cm) and are relatively drought-tolerant. They're grown in both Kharif and Rabi seasons. Oilseed cultivation is suitable for regions with moderate rainfall and good drainage. Different oilseeds take 90-150 days to mature and yield 1-2 tons per acre. Oilseeds have good market demand and export potential.`,
    metadata: {
      crop: 'Oilseeds',
      category: 'Oilseeds',
      season: ['Kharif', 'Rabi'],
      soilType: ['Loamy', 'Sandy', 'Clay'],
      regions: ['Madhya Pradesh', 'Rajasthan', 'Gujarat', 'Maharashtra', 'Karnataka']
    }
  },
  {
    content: `Vegetables (various species) are high-value crops that require intensive cultivation. They prefer rich, well-drained soil and moderate temperatures (15-30°C). Vegetables require regular irrigation and moderate rainfall (50-100cm). They're grown year-round with different varieties for different seasons. Vegetable cultivation is suitable for regions with good irrigation facilities and proximity to markets. Different vegetables take 60-120 days to mature and yield varies widely. Vegetables have excellent market demand and high profitability potential.`,
    metadata: {
      crop: 'Vegetables',
      category: 'Vegetables',
      season: ['Kharif', 'Rabi', 'Zaid'],
      soilType: ['Loamy', 'Clay'],
      regions: ['All regions with good irrigation']
    }
  },
  {
    content: `Fruits (various species) are perennial crops that require specific climatic conditions. They prefer well-drained soil and moderate temperatures (15-30°C). Fruits require regular irrigation and moderate rainfall (50-150cm). They're grown year-round with different varieties for different seasons. Fruit cultivation is suitable for regions with good irrigation facilities and suitable climate. Different fruits take 2-5 years to start bearing and yield varies widely. Fruits have excellent market demand and high profitability potential.`,
    metadata: {
      crop: 'Fruits',
      category: 'Fruits',
      season: ['Year-round'],
      soilType: ['Loamy', 'Clay', 'Sandy'],
      regions: ['All regions with suitable climate']
    }
  }
];

async function seedCropKnowledge() {
  try {
    console.log('🌱 Starting crop knowledge base seeding...');
    
    const aiService = new AIService();
    
    // Wait for AI service to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const crop of cropKnowledge) {
      try {
        await aiService.addToKnowledgeBase(crop.content, crop.metadata);
        successCount++;
        console.log(`✅ Added: ${crop.metadata.crop}`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to add ${crop.metadata.crop}:`, error.message);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n📊 Seeding completed:`);
    console.log(`✅ Successfully added: ${successCount} crops`);
    console.log(`❌ Failed to add: ${errorCount} crops`);
    console.log(`📚 Total documents in knowledge base: ${aiService.vectorDB.length}`);
    
    // Save the vector database
    const vectorDBFile = path.join(process.env.VECTOR_DB_PATH || './data/vector_db', 'embeddings.json');
    await fs.writeJson(vectorDBFile, aiService.vectorDB, { spaces: 2 });
    console.log(`💾 Vector database saved to: ${vectorDBFile}`);
    
  } catch (error) {
    console.error('❌ Error seeding crop knowledge:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  seedCropKnowledge();
}

module.exports = { seedCropKnowledge };


