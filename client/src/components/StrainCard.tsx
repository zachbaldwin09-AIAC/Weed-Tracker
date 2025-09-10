import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, Bookmark } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface StrainCardProps {
  strain: {
    id: string;
    name: string;
    type: 'Indica' | 'Sativa' | 'Hybrid';
    thcContent: number;
    description?: string;
  };
  userExperience?: {
    liked?: boolean;
    notes?: string;
    saved?: boolean;
  };
}

export function StrainCard({ strain, userExperience }: StrainCardProps) {
  const [liked, setLiked] = useState(userExperience?.liked);
  const [notes, setNotes] = useState(userExperience?.notes || "");
  const [saved, setSaved] = useState(userExperience?.saved || false);
  const [showNotes, setShowNotes] = useState(false);

  const handleLike = () => {
    console.log(`Liked strain: ${strain.name}`);
    setLiked(liked === true ? undefined : true);
  };

  const handleDislike = () => {
    console.log(`Disliked strain: ${strain.name}`);
    setLiked(liked === false ? undefined : false);
  };

  const handleSave = () => {
    console.log(`${saved ? 'Unsaved' : 'Saved'} strain: ${strain.name}`);
    setSaved(!saved);
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    console.log(`Notes updated for ${strain.name}: ${value}`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Indica': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Sativa': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Hybrid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="w-full hover-elevate" data-testid={`card-strain-${strain.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-card-foreground" data-testid={`text-strain-name-${strain.id}`}>
              {strain.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getTypeColor(strain.type)} data-testid={`badge-strain-type-${strain.id}`}>
                {strain.type}
              </Badge>
              <span className="text-sm text-muted-foreground" data-testid={`text-thc-content-${strain.id}`}>
                {strain.thcContent}% THC
              </span>
            </div>
          </div>
          <Button 
            size="icon" 
            variant="ghost"
            onClick={handleSave}
            className={saved ? "text-primary" : ""}
            data-testid={`button-save-${strain.id}`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </Button>
        </div>
        {strain.description && (
          <p className="text-sm text-muted-foreground mt-2" data-testid={`text-strain-description-${strain.id}`}>
            {strain.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 mb-3">
          <Button
            size="sm"
            variant={liked === true ? "default" : "outline"}
            onClick={handleLike}
            className="flex-1"
            data-testid={`button-like-${strain.id}`}
          >
            <ThumbsUp className="w-4 h-4 mr-1" />
            Like
          </Button>
          <Button
            size="sm"
            variant={liked === false ? "destructive" : "outline"}
            onClick={handleDislike}
            className="flex-1"
            data-testid={`button-dislike-${strain.id}`}
          >
            <ThumbsDown className="w-4 h-4 mr-1" />
            Dislike
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowNotes(!showNotes)}
            data-testid={`button-notes-toggle-${strain.id}`}
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
        
        {showNotes && (
          <div className="space-y-2">
            <Textarea
              placeholder="Add your notes about this strain..."
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="min-h-[80px] text-sm"
              data-testid={`textarea-notes-${strain.id}`}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}