import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Music, Clock, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Song {
  title: string;
  artist: string;
  youtubeLink?: string;
}

interface SongListProps {
  songs: Song[];
  className?: string;
}

const SongList: React.FC<SongListProps> = ({ songs, className }) => {
  return (
    <Card className={cn("overflow-hidden shadow-lg animate-scale-in", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Recommended Songs</CardTitle>
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Latest Releases</span>
        </Badge>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-3">
          {songs.map((song, index) => (
            <li key={index} className="p-3 bg-background rounded-lg shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="font-medium">{song.title}</div>
                  <div className="text-sm text-muted-foreground">{song.artist}</div>
                </div>
                {song.youtubeLink && (
                  <a 
                    href={song.youtubeLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button size="sm" variant="outline" className="rounded-full h-8 w-8 p-0">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Listen on YouTube</span>
                    </Button>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pb-3 pt-0 px-4">
        <p className="text-xs text-muted-foreground italic flex items-center gap-1">
          <RefreshCw className="h-3 w-3" />
          <span>Click "New Suggestions" for different song recommendations</span>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SongList;
