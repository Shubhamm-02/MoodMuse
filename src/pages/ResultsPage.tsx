import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMood } from "@/context/MoodContext";
import QuoteCard from "@/components/QuoteCard";
import AffirmationCard from "@/components/AffirmationCard";
import SongList from "@/components/SongList";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedMood, moodContent, loading, error, favorites, generateContent, addToFavorites, removeFromFavorites } = useMood();
  const [isFavorite, setIsFavorite] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [geminiLoading, setGeminiLoading] = useState(false);
  
  // Check if Gemini API is configured and whether to force mock data
  const isGeminiEnabled = Boolean(import.meta.env.VITE_GEMINI_API_KEY);
  const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
  const usingGemini = isGeminiEnabled && !useMockData;

  // Redirect if no mood is selected
  useEffect(() => {
    if (!selectedMood && !loading) {
      navigate("/mood-selector");
    }
  }, [selectedMood, loading, navigate]);

  // Check if current content is in favorites
  useEffect(() => {
    if (moodContent && favorites.length > 0) {
      const isInFavorites = favorites.some(
        fav => fav.quote === moodContent.quote && fav.affirmation === moodContent.affirmation
      );
      setIsFavorite(isInFavorites);
    } else {
      setIsFavorite(false);
    }
  }, [moodContent, favorites]);

  // Handle toggling favorite status
  const handleToggleFavorite = () => {
    if (!moodContent) return;
    
    if (isFavorite) {
      removeFromFavorites(moodContent);
    } else {
      addToFavorites(moodContent);
    }
  };

  // Handle refresh for new content with same mood
  const handleRefresh = async () => {
    setRefreshing(true);
    if (usingGemini) {
      setGeminiLoading(true);
    }
    await generateContent();
    setRefreshing(false);
    setGeminiLoading(false);
  };

  if (loading || refreshing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium mb-4">
            {refreshing 
              ? usingGemini && geminiLoading
                ? "Generating AI recommendations..."
                : "Refreshing your inspiration..."
              : "Finding inspiration for your mood..."
            }
          </h2>
          <div className="flex flex-col items-center">
            <LoadingSpinner size="lg" />
            {usingGemini && geminiLoading && (
              <div className="mt-4 max-w-md">
                <p className="text-sm text-muted-foreground mb-2">Gemini AI is analyzing your mood to create personalized recommendations.</p>
                <div className="flex justify-center">
                  <Badge variant="outline" className="animate-pulse">Powered by Gemini AI</Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
        <div className="text-center mb-8 max-w-md">
          <h2 className="text-2xl font-medium mb-4 text-destructive">Something went wrong</h2>
          <p className="mb-6">{error}</p>
          <Button onClick={() => navigate("/mood-selector")}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!moodContent) {
    return null; // This should not happen because of the redirect
  }

  return (
    <div 
      className="min-h-screen flex flex-col px-4 py-12"
      style={{
        backgroundImage: moodContent.backgroundImage 
          ? `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${moodContent.backgroundImage})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <div className={`inline-block px-4 py-2 bg-mood-${selectedMood} rounded-full text-sm font-medium capitalize`}>
              {selectedMood} Mood
            </div>
            {usingGemini ? (
              <Badge variant="secondary" className="rounded-full">
                Powered by Gemini AI
              </Badge>
            ) : (
              <Badge variant="outline" className="rounded-full">
                Using Mock Data
              </Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Your Personalized Inspiration</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <QuoteCard 
            quote={moodContent.quote} 
            isFavorite={isFavorite}
            onFavorite={handleToggleFavorite}
          />
          <AffirmationCard affirmation={moodContent.affirmation} />
        </div>

        <SongList songs={moodContent.songs} className="mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Button 
            onClick={handleRefresh}
            size="lg"
            className="w-full sm:w-auto"
          >
            New Suggestions
          </Button>

          <Button 
            onClick={() => navigate("/mood-selector")}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Try Another Mood
          </Button>
          
          <Button 
            onClick={() => navigate("/favorites")}
            variant="outline"
            className="w-full sm:w-auto"
          >
            View Favorites
          </Button>
          
          <Button 
            onClick={() => navigate("/")}
            variant="ghost"
            className="w-full sm:w-auto"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
