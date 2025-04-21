import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { generateMoodContent } from "@/lib/gemini";

type Mood = "happy" | "sad" | "chill" | "angry" | "excited" | "lonely" | null;

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

interface MoodContextType {
  selectedMood: Mood;
  moodContent: MoodContent | null;
  loading: boolean;
  error: string | null;
  favorites: MoodContent[];
  setSelectedMood: (mood: Mood) => void;
  generateContent: () => Promise<void>;
  addToFavorites: (content: MoodContent) => void;
  removeFromFavorites: (content: MoodContent) => void;
}

// Create context with default values
const MoodContext = createContext<MoodContextType>({
  selectedMood: null,
  moodContent: null,
  loading: false,
  error: null,
  favorites: [],
  setSelectedMood: () => {},
  generateContent: async () => {},
  addToFavorites: () => {},
  removeFromFavorites: () => {},
});

// Expanded song collections for each mood
const songCollections = {
  happy: [
    { title: "Fortnight", artist: "Taylor Swift", youtubeLink: "https://www.youtube.com/watch?v=5GgtNmrIhRA" },
    { title: "Espresso", artist: "Sabrina Carpenter", youtubeLink: "https://www.youtube.com/watch?v=8_JdY98wGqU" },
    { title: "Good Luck, Babe!", artist: "Chappell Roan", youtubeLink: "https://www.youtube.com/watch?v=QUpdmR2vz_s" },
    { title: "Cruel Summer", artist: "Taylor Swift", youtubeLink: "https://www.youtube.com/watch?v=ic8j13piAhQ" },
    { title: "Paint The Town Red", artist: "Doja Cat", youtubeLink: "https://www.youtube.com/watch?v=CCMC-tm2G0g" },
    { title: "This Is Why", artist: "Paramore", youtubeLink: "https://www.youtube.com/watch?v=xIYJ7VaSxYY" },
    { title: "Die With A Smile", artist: "Lady Gaga & Bruno Mars", youtubeLink: "https://www.youtube.com/watch?v=_Iitj7YoKm4" },
    { title: "Please Please Please", artist: "Sabrina Carpenter", youtubeLink: "https://www.youtube.com/watch?v=vfHV1xXk6rU" },
  ],
  sad: [
    { title: "Lose You to Love Me", artist: "Selena Gomez", youtubeLink: "https://www.youtube.com/watch?v=zlJDTxahav0" },
    { title: "Last Thing On My Mind", artist: "Gracie Abrams", youtubeLink: "https://www.youtube.com/watch?v=fLVfoMfGiKM" },
    { title: "A Bar Song (Tipsy)", artist: "Shaboozey", youtubeLink: "https://www.youtube.com/watch?v=KBNitGpL4u8" },
    { title: "Blindsided", artist: "Bon Iver", youtubeLink: "https://www.youtube.com/watch?v=f3GC8nAr6b8" },
    { title: "Vampire", artist: "Olivia Rodrigo", youtubeLink: "https://www.youtube.com/watch?v=ujm8zTh0-u8" },
    { title: "Glimpse of Us", artist: "Joji", youtubeLink: "https://www.youtube.com/watch?v=FvOpPeKSf_4" },
    { title: "Ghost", artist: "Justin Bieber", youtubeLink: "https://www.youtube.com/watch?v=Fp8msa5uYsc" },
    { title: "Please Please Please", artist: "Sabrina Carpenter", youtubeLink: "https://www.youtube.com/watch?v=vfHV1xXk6rU" },
  ],
  chill: [
    { title: "Lavender Haze", artist: "Taylor Swift", youtubeLink: "https://www.youtube.com/watch?v=mkR_Qwix4Ho" },
    { title: "Birds of a Feather", artist: "Billie Eilish", youtubeLink: "https://www.youtube.com/watch?v=WuG3k3j26s4" },
    { title: "Snooze", artist: "SZA", youtubeLink: "https://www.youtube.com/watch?v=nJxWa5L9G_I" },
    { title: "Slow Moving Train", artist: "Rihanna", youtubeLink: "https://www.youtube.com/watch?v=BuDfbYe-JKw" },
    { title: "Younger", artist: "Reneé Rapp", youtubeLink: "https://www.youtube.com/watch?v=Xv5rCiRFn2c" },
    { title: "Flowers", artist: "Miley Cyrus", youtubeLink: "https://www.youtube.com/watch?v=G7KNmW9a75Y" },
    { title: "Houdini", artist: "Dua Lipa", youtubeLink: "https://www.youtube.com/watch?v=L0J9Di1MGCU" },
    { title: "Daylight", artist: "David Kushner", youtubeLink: "https://www.youtube.com/watch?v=Q2wTOvY2XAA" },
  ],
  angry: [
    { title: "Not My Problem", artist: "Dua Lipa", youtubeLink: "https://www.youtube.com/watch?v=A7AkWtEuLsA" },
    { title: "Bad Idea Right?", artist: "Olivia Rodrigo", youtubeLink: "https://www.youtube.com/watch?v=88bDpYwx3n4" },
    { title: "Burn", artist: "Megan Thee Stallion", youtubeLink: "https://www.youtube.com/watch?v=4HiJy8qCeAM" },
    { title: "Butterfly", artist: "Lil Nas X", youtubeLink: "https://www.youtube.com/watch?v=qU3M_3gyAuE" },
    { title: "Savage", artist: "Megan Thee Stallion", youtubeLink: "https://www.youtube.com/watch?v=yE-glh4OciY" },
    { title: "Losers", artist: "Olivia Rodrigo", youtubeLink: "https://www.youtube.com/watch?v=HpKoAnGNTI0" },
    { title: "Rockstar", artist: "Post Malone", youtubeLink: "https://www.youtube.com/watch?v=UceaB4D0jpo" },
    { title: "Rock + Roll", artist: "EDEN", youtubeLink: "https://www.youtube.com/watch?v=geZ_5Ri7ANg" },
  ],
  excited: [
    { title: "On My Mama", artist: "Victoria Monét", youtubeLink: "https://www.youtube.com/watch?v=qM6Gi3hRMTs" },
    { title: "Houdini", artist: "Dua Lipa", youtubeLink: "https://www.youtube.com/watch?v=L0J9Di1MGCU" },
    { title: "Dance The Night", artist: "Dua Lipa", youtubeLink: "https://www.youtube.com/watch?v=7gME2N6SgN4" },
    { title: "Die With A Smile", artist: "Lady Gaga & Bruno Mars", youtubeLink: "https://www.youtube.com/watch?v=_Iitj7YoKm4" },
    { title: "Butterfly", artist: "Lil Nas X", youtubeLink: "https://www.youtube.com/watch?v=qU3M_3gyAuE" },
    { title: "Bongos", artist: "Cardi B & Megan Thee Stallion", youtubeLink: "https://www.youtube.com/watch?v=bohW5nyX5xM" },
    { title: "MONTERO", artist: "Lil Nas X", youtubeLink: "https://www.youtube.com/watch?v=6swmTBVI83k" },
    { title: "Nonsense", artist: "Sabrina Carpenter", youtubeLink: "https://www.youtube.com/watch?v=09I1G4RinS0" },
  ],
  lonely: [
    { title: "Saturn", artist: "SZA", youtubeLink: "https://www.youtube.com/watch?v=Fx2IZQ6nXwM" },
    { title: "Lonely", artist: "Megan Thee Stallion", youtubeLink: "https://www.youtube.com/watch?v=E1vNkMLgVIw" },
    { title: "Stick Season", artist: "Noah Kahan", youtubeLink: "https://www.youtube.com/watch?v=JHHExAl5q7g" },
    { title: "Somebody", artist: "Reneé Rapp", youtubeLink: "https://www.youtube.com/watch?v=o81TjTsT6kc" },
    { title: "Nobody Gets Me", artist: "SZA", youtubeLink: "https://www.youtube.com/watch?v=zTXw15hqTGQ" },
    { title: "Glimpse of Us", artist: "Joji", youtubeLink: "https://www.youtube.com/watch?v=FvOpPeKSf_4" },
    { title: "Stuck with U", artist: "Ariana Grande & Justin Bieber", youtubeLink: "https://www.youtube.com/watch?v=pE49WK-oNjU" },
    { title: "Better Alone", artist: "Carolina Gaitán", youtubeLink: "https://www.youtube.com/watch?v=MbmMrxzHPxc" },
  ],
};

// Function to get random songs for a mood
const getRandomSongsForMood = (mood: Mood, count: number = 3): { title: string; artist: string; youtubeLink: string }[] => {
  if (!mood) return [];
  
  const songs = songCollections[mood];
  if (!songs || songs.length === 0) return [];
  
  // Shuffle the songs array
  const shuffled = [...songs].sort(() => 0.5 - Math.random());
  // Take the first 'count' songs
  return shuffled.slice(0, count);
};

// Fallback mock data in case the API fails or is not configured
const getMockContent = (mood: Mood): MoodContent => {
  const baseContent = {
    happy: {
      quote: "Happiness is not something ready-made. It comes from your own actions.",
      affirmation: "I choose to be happy and spread joy to those around me.",
      backgroundImage: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2076&auto=format&fit=crop",
    },
    sad: {
      quote: "Tears are words that need to be written.",
      affirmation: "I honor my feelings but do not let them define me. This too shall pass.",
      backgroundImage: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=2151&auto=format&fit=crop",
    },
    chill: {
      quote: "Life isn't as serious as the mind makes it out to be.",
      affirmation: "I am present and at peace with this moment exactly as it is.",
      backgroundImage: "https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=2070&auto=format&fit=crop",
    },
    angry: {
      quote: "Speak when you are angry and you will make the best speech you will ever regret.",
      affirmation: "I release my anger and choose responses that serve my highest good.",
      backgroundImage: "https://images.unsplash.com/photo-1439792675105-701e6a4ab6f0?q=80&w=2073&auto=format&fit=crop",
    },
    excited: {
      quote: "The future belongs to those who believe in the beauty of their dreams.",
      affirmation: "I embrace the energy of possibility and opportunity all around me.",
      backgroundImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop",
    },
    lonely: {
      quote: "Sometimes you need to be alone to reflect on life. Take time to take care of yourself.",
      affirmation: "I am complete within myself. Solitude offers me space to grow and reflect.",
      backgroundImage: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=2073&auto=format&fit=crop",
    },
  }[mood];

  return {
    ...baseContent,
    songs: getRandomSongsForMood(mood),
  };
};

// Provider component
export const MoodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedMood, setSelectedMood] = useState<Mood>(null);
  const [moodContent, setMoodContent] = useState<MoodContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<MoodContent[]>([]);

  // Check if Gemini API key is configured and whether to force mock data
  const isApiConfigured = Boolean(import.meta.env.VITE_GEMINI_API_KEY);
  const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("moodmuseFavorites");
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error("Error parsing favorites from localStorage:", e);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("moodmuseFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // Function to generate content based on selected mood
  const generateContent = async () => {
    if (!selectedMood) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (isApiConfigured && !useMockData) {
        // Use Gemini API to generate personalized content
        console.log(`Attempting to generate content for ${selectedMood} mood with Gemini...`);
        const content = await generateMoodContent(selectedMood);
        console.log("Successfully received content from Gemini:", content);
        setMoodContent(content);
      } else {
        // Fall back to mock data if API key is not configured or mock data is forced
        const reason = useMockData ? "Mock data usage forced by environment variable." : "Gemini API key not configured.";
        console.warn(`${reason} Using mock data instead.`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        setMoodContent(getMockContent(selectedMood));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error generating content:", err);
      
      // If Gemini API fails, fall back to mock data
      try {
        console.warn(`Error with Gemini API: ${errorMessage}. Falling back to mock data.`);
        setMoodContent(getMockContent(selectedMood));
      } catch (fallbackErr) {
        const fallbackErrorMessage = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
        console.error("Error with fallback data:", fallbackErr);
        setError(`Failed to generate content. Error: ${errorMessage}. Fallback error: ${fallbackErrorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to add content to favorites
  const addToFavorites = (content: MoodContent) => {
    setFavorites(prevFavorites => {
      // Check if already in favorites
      const isAlreadyFavorite = prevFavorites.some(
        fav => fav.quote === content.quote && fav.affirmation === content.affirmation
      );
      
      if (isAlreadyFavorite) return prevFavorites;
      return [...prevFavorites, content];
    });
  };

  // Function to remove content from favorites
  const removeFromFavorites = (content: MoodContent) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(
        fav => !(fav.quote === content.quote && fav.affirmation === content.affirmation)
      )
    );
  };

  return (
    <MoodContext.Provider
      value={{
        selectedMood,
        moodContent,
        loading,
        error,
        favorites,
        setSelectedMood,
        generateContent,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </MoodContext.Provider>
  );
};

// Custom hook to use the mood context
export const useMood = () => useContext(MoodContext);
