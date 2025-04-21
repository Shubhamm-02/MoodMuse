import React from "react";
import { cn } from "@/lib/utils";
import { Smile, Frown, Snowflake, Flame, Zap, UserMinus } from "lucide-react";

type MoodType = "happy" | "sad" | "chill" | "angry" | "excited" | "lonely";

interface MoodCardProps {
  mood: MoodType;
  onClick: (mood: MoodType) => void;
  selected?: boolean;
  disabled?: boolean;
}

const MoodCard: React.FC<MoodCardProps> = ({ 
  mood, 
  onClick, 
  selected = false, 
  disabled = false 
}) => {
  const getMoodIcon = () => {
    switch (mood) {
      case "happy":
        return <Smile className="h-8 w-8" />;
      case "sad":
        return <Frown className="h-8 w-8" />;
      case "chill":
        return <Snowflake className="h-8 w-8" />;
      case "angry":
        return <Flame className="h-8 w-8" />;
      case "excited":
        return <Zap className="h-8 w-8" />;
      case "lonely":
        return <UserMinus className="h-8 w-8" />;
      default:
        return null;
    }
  };

  const getMoodColor = () => {
    switch (mood) {
      case "happy": return "bg-mood-happy text-amber-800";
      case "sad": return "bg-mood-sad text-blue-800";
      case "chill": return "bg-mood-chill text-green-800";
      case "angry": return "bg-mood-angry text-red-800";
      case "excited": return "bg-mood-excited text-purple-800";
      case "lonely": return "bg-mood-lonely text-indigo-800";
      default: return "bg-secondary";
    }
  };

  const handleClick = () => {
    if (!disabled) {
      onClick(mood);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 rounded-2xl shadow-md transition-all duration-300 transform",
        getMoodColor(),
        selected ? "ring-4 ring-primary scale-105" : "",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105 animate-fade-in"
      )}
      onClick={handleClick}
    >
      <div className="text-3xl mb-3">{getMoodIcon()}</div>
      <h3 className="font-medium text-lg capitalize">{mood}</h3>
    </div>
  );
};

export default MoodCard;
