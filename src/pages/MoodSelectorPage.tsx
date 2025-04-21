import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMood } from "@/context/MoodContext";
import MoodCard from "@/components/MoodCard";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";

const MoodSelectorPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedMood, setSelectedMood, generateContent } = useMood();
  const [loading, setLoading] = useState(false);
  
  // Check if Gemini API is configured
  const isGeminiEnabled = Boolean(import.meta.env.VITE_GEMINI_API_KEY);
  const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
  const usingGemini = isGeminiEnabled && !useMockData;

  const moods = ["happy", "sad", "chill", "angry", "excited", "lonely"] as const;

  const handleMoodSelect = (mood: typeof moods[number]) => {
    setSelectedMood(mood);
  };

  const handleContinue = async () => {
    setLoading(true);
    await generateContent();
    setLoading(false);
    navigate("/results");
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-12 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">How are you feeling today?</h1>
          <p className="text-lg text-muted-foreground">
            Select a mood to get personalized inspiration
          </p>
          {usingGemini && (
            <div className="mt-2">
              <Badge variant="secondary">Powered by Gemini AI</Badge>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {moods.map((mood) => (
            <MoodCard
              key={mood}
              mood={mood}
              onClick={handleMoodSelect}
              selected={selectedMood === mood}
              disabled={loading}
            />
          ))}
        </div>

        <div className="flex flex-col items-center justify-center mt-12">
          {loading ? (
            <div className="text-center mb-4">
              <div className="flex flex-col items-center">
                <LoadingSpinner size="md" />
                <p className="mt-4 text-muted-foreground">
                  {usingGemini ? 
                    "Generating personalized recommendations with Gemini AI..." : 
                    "Preparing your recommendations..."}
                </p>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleContinue}
              size="lg"
              disabled={!selectedMood}
              className="px-8 py-6 text-lg rounded-full shadow-lg"
            >
              Continue
            </Button>
          )}
        </div>
        
        <div className="mt-8 text-center">
          {!loading && (
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="text-muted-foreground"
            >
              Back to Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodSelectorPage;
