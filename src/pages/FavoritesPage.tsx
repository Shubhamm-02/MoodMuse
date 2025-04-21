
import React from "react";
import { useNavigate } from "react-router-dom";
import { useMood } from "@/context/MoodContext";
import QuoteCard from "@/components/QuoteCard";
import AffirmationCard from "@/components/AffirmationCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, removeFromFavorites } = useMood();

  return (
    <div className="min-h-screen flex flex-col px-4 py-12 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Favorites</h1>
          <p className="text-muted-foreground">
            Inspiration you've saved for later
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl mb-6">You haven't saved any favorites yet.</p>
            <Button onClick={() => navigate("/mood-selector")}>
              Find Some Inspiration
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {favorites.map((item, index) => (
              <div key={index} className="bg-background rounded-lg shadow-md p-6 animate-scale-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <QuoteCard 
                    quote={item.quote} 
                    isFavorite={true}
                    onFavorite={() => removeFromFavorites(item)}
                  />
                  <AffirmationCard affirmation={item.affirmation} />
                </div>
                
                {index < favorites.length - 1 && (
                  <Separator className="mt-6" />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="mx-2"
          >
            Back to Home
          </Button>
          <Button 
            onClick={() => navigate("/mood-selector")}
            className="mx-2"
          >
            Find New Inspiration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
