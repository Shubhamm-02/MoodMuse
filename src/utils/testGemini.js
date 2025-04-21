/**
 * Simple test script for the Gemini API
 * 
 * Run this script directly with Node.js to test if the Gemini API is working:
 * - Create a .env file with your GEMINI_API_KEY
 * - Run: node src/utils/testGemini.js
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Replace with your actual API key when testing
const API_KEY = process.env.GEMINI_API_KEY || "your_api_key_here";

async function testGeminiApi() {
  try {
    console.log("Testing Gemini API connection...");
    
    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Test with both models to see which one works
    const models = [
      { name: 'gemini-1.5-pro', model: genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }) },
      { name: 'gemini-2.0-flash', model: genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }) }
    ];
    
    for (const { name, model } of models) {
      console.log(`\nTesting ${name}...`);
      
      try {
        // Simple prompt to test the API
        const prompt = `
          Generate a response in JSON format with the following structure:
          {
            "mood": "happy",
            "quote": "A happy quote",
            "songs": [{"title": "Song 1", "artist": "Artist 1"}]
          }
          
          Please return ONLY the JSON with no additional text.
        `;
        
        console.log("Sending request...");
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        console.log(`\n${name} response:`);
        console.log(text);
        
        // Try to parse as JSON
        try {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          const jsonStr = jsonMatch ? jsonMatch[0] : text;
          const parsed = JSON.parse(jsonStr);
          console.log(`\n${name} parsed JSON:`, parsed);
          console.log(`\n${name} TEST SUCCESSFUL ✅`);
        } catch (parseError) {
          console.log(`\n${name} failed to parse response as JSON:`, parseError.message);
          console.log(`\n${name} TEST FAILED ❌ (JSON parsing issue)`);
        }
      } catch (modelError) {
        console.log(`\n${name} ERROR:`, modelError.message);
        console.log(`\n${name} TEST FAILED ❌`);
      }
    }
    
  } catch (error) {
    console.error("General error testing Gemini API:", error.message);
    console.log("\nTEST FAILED ❌");
  }
}

testGeminiApi(); 