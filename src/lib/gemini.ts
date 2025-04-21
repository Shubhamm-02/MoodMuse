import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with the API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);

// The main model for content generation - updated to use the 2.0 flash model
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

interface MoodContent {
  quote: string;
  affirmation: string;
  songs: { 
    title: string; 
    artist: string;
    youtubeLink?: string;
  }[];
  backgroundImage?: string;
}

/**
 * Generates personalized content based on the user's mood using Gemini API
 * @param mood The user's selected mood
 * @returns A promise that resolves to mood-specific content
 */
export async function generateMoodContent(mood: string): Promise<MoodContent> {
  try {
    // Add a timestamp to make each request unique
    const timestamp = new Date().getTime();
    const randomSeed = Math.floor(Math.random() * 10000);
    
    // Create a more structured prompt for generating mood-based content
    const prompt = `
      I need a response in JSON format that contains mood-based content for a user feeling "${mood}".
      This is request #${timestamp}-${randomSeed}, please provide DIFFERENT song recommendations 
      than you might have given in previous requests.
      
      Your response must be a valid JSON object with exactly these fields:
      - quote: A meaningful and inspirational quote that resonates with a ${mood} mood
      - affirmation: A positive affirmation that helps navigate a ${mood} mood
      - songs: An array of exactly 3 objects, each with "title", "artist", and "youtubeLink" properties
      
      For the songs:
      1. ONLY recommend recent songs released between 2023-2024
      2. IMPORTANT: Please select RANDOM, VARIED songs - do not repeat the most obvious or popular choices
      3. Be creative and diverse in your music selection - include different artists and genres
      4. Do not recommend the same songs that would typically be recommended for this mood
      
      For example, the correct JSON format for a "happy" mood would be:
      {
        "quote": "The happiest people don't have the best of everything, they make the best of everything.",
        "affirmation": "I radiate joy and positivity in everything I do today.",
        "songs": [
          {"title": "Fortnight", "artist": "Taylor Swift", "youtubeLink": "https://www.youtube.com/watch?v=5GgtNmrIhRA"},
          {"title": "Espresso", "artist": "Sabrina Carpenter", "youtubeLink": "https://www.youtube.com/watch?v=8_JdY98wGqU"},
          {"title": "Good Luck, Babe!", "artist": "Chappell Roan", "youtubeLink": "https://www.youtube.com/watch?v=QUpdmR2vz_s"}
        ]
      }
      
      IMPORTANT:
      1. Respond ONLY with the JSON object, no additional text
      2. Ensure the content is appropriate and uplifting
      3. ONLY recommend songs released in 2023-2024 that match the ${mood} mood
      4. For each song, include a valid YouTube link to the official music video or a high-quality version
      5. The quotes and affirmations should be appropriate for someone feeling ${mood}
      6. Your recommendations should feel fresh and different each time - avoid obvious choices
    `;

    console.log(`Generating content for ${mood} mood with gemini-2.0-flash...`);
    
    // Generate content from Gemini
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    console.log("Raw Gemini response:", text);
    
    // Parse the JSON response
    let content: MoodContent;
    
    try {
      // Extract JSON from the response (handling cases where AI might add extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      console.log("Extracted JSON string:", jsonStr);
      
      content = JSON.parse(jsonStr);
      
      // Validate the content structure
      if (!content.quote || !content.affirmation || !Array.isArray(content.songs)) {
        console.error("Invalid content structure:", content);
        throw new Error("Invalid content structure from AI response");
      }
      
      // Ensure we have exactly 3 songs
      if (content.songs.length < 3) {
        console.warn(`Only ${content.songs.length} songs returned, adding placeholder songs`);
        const defaultSongs = [
          { title: "Fortnight", artist: "Taylor Swift", youtubeLink: "https://www.youtube.com/watch?v=5GgtNmrIhRA" },
          { title: "Espresso", artist: "Sabrina Carpenter", youtubeLink: "https://www.youtube.com/watch?v=8_JdY98wGqU" },
          { title: "Birds of a Feather", artist: "Billie Eilish", youtubeLink: "https://www.youtube.com/watch?v=WuG3k3j26s4" }
        ];
        
        // Add missing songs
        while (content.songs.length < 3) {
          content.songs.push(defaultSongs[content.songs.length]);
        }
      } else if (content.songs.length > 3) {
        console.warn(`More than 3 songs returned, trimming to 3`);
        content.songs = content.songs.slice(0, 3);
      }
      
      // Validate each song has title, artist and youtubeLink
      content.songs.forEach((song, index) => {
        if (!song.title || !song.artist) {
          console.warn(`Song at index ${index} missing title or artist, fixing...`);
          song.title = song.title || `Unknown Song ${index + 1}`;
          song.artist = song.artist || "Unknown Artist";
        }
        
        // Ensure each song has a YouTube link
        if (!song.youtubeLink || !song.youtubeLink.includes('youtube.com')) {
          console.warn(`Song "${song.title}" missing valid YouTube link, adding default`);
          // Try to create a search link if we have title and artist
          song.youtubeLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${song.title} ${song.artist}`)}`;
        }
      });
    } catch (error) {
      console.error("Failed to parse Gemini response:", error);
      console.error("Response that failed parsing:", text);
      throw new Error("Failed to generate proper content from AI response");
    }
    
    // Select a background image based on mood
    // These are placeholder images that we can keep from the mock implementation
    const backgroundImages: Record<string, string> = {
      happy: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2076&auto=format&fit=crop",
      sad: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=2151&auto=format&fit=crop",
      chill: "https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=2070&auto=format&fit=crop",
      angry: "https://images.unsplash.com/photo-1439792675105-701e6a4ab6f0?q=80&w=2073&auto=format&fit=crop",
      excited: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop",
      lonely: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=2073&auto=format&fit=crop",
    };
    
    // Add the background image to the content
    content.backgroundImage = backgroundImages[mood] || backgroundImages.happy;
    
    console.log("Final content:", content);
    return content;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw new Error("Failed to generate personalized content");
  }
} 