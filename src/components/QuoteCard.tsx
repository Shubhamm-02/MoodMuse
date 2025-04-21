
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface QuoteCardProps {
  quote: string;
  isFavorite?: boolean;
  onFavorite?: () => void;
  className?: string;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ 
  quote, 
  isFavorite = false, 
  onFavorite, 
  className 
}) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(quote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Card className={cn("overflow-hidden shadow-lg animate-scale-in", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="text-4xl mb-4">"</div>
          <p className="text-lg font-medium italic mb-4">{quote}</p>
          <div className="text-4xl">"</div>
          
          <div className="flex justify-center gap-2 mt-4">
            {onFavorite && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onFavorite}
              >
                {isFavorite ? "★ Favorited" : "☆ Add to Favorites"}
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyToClipboard}
            >
              {copied ? "Copied!" : <><Clipboard className="h-4 w-4 mr-1" /> Share</>}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;
