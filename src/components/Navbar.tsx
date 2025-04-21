
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show navbar on home page since we want a clean hero page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <header className="w-full bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16 px-4">
        <div 
          className="font-bold text-xl cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            MoodMuse
          </span>
        </div>
        
        <nav className="flex items-center space-x-1">
          <Button
            variant={location.pathname === "/mood-selector" ? "default" : "ghost"}
            size="sm"
            onClick={() => navigate("/mood-selector")}
          >
            Moods
          </Button>
          
          <Button
            variant={location.pathname === "/favorites" ? "default" : "ghost"}
            size="sm"
            onClick={() => navigate("/favorites")}
          >
            Favorites
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
