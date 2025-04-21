
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="w-full max-w-lg mx-auto text-center space-y-8 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          MoodMuse
        </h1>
        
        <p className="text-xl md:text-2xl font-medium text-foreground/80 animate-pulse-soft">
          Find your vibe. Inspire your mind.
        </p>
        
        <div className="mt-12 space-y-4 animate-float">
          <p className="text-lg text-muted-foreground">
            Discover personalized inspiration based on your current mood.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={() => navigate("/mood-selector")}
              size="lg" 
              className="mt-6 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </Button>
            
            <div className="mt-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/favorites")}
                className="text-muted-foreground hover:text-primary"
              >
                View Saved Favorites
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 w-full text-center text-sm text-muted-foreground">
        <p>Powered by AI • Custom inspiration for every mood</p>
      </div>
    </div>
  );
};

export default HomePage;
