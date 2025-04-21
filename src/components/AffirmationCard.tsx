
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AffirmationCardProps {
  affirmation: string;
  className?: string;
}

const AffirmationCard: React.FC<AffirmationCardProps> = ({ affirmation, className }) => {
  return (
    <Card className={cn("overflow-hidden shadow-lg bg-secondary/80 animate-scale-in", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <h3 className="text-lg font-medium mb-3">Today's Affirmation</h3>
          <p className="text-lg">{affirmation}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AffirmationCard;
