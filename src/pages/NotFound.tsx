
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-medium mb-6">Page Not Found</h2>
        <p className="mb-8 text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate("/")} size="lg">
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
