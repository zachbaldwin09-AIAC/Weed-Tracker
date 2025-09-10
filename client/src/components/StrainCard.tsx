import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ThumbsUp, ThumbsDown, MessageSquare, Bookmark } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertUserStrainExperience, UserStrainExperience } from "@shared/schema";

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
  const [liked, setLiked] = useState<boolean | null>(userExperience?.liked ?? null);
  const [notes, setNotes] = useState(userExperience?.notes || "");
  const [saved, setSaved] = useState(userExperience?.saved || false);
  const [showNotes, setShowNotes] = useState(false);
  const { toast } = useToast();
  
  // TODO: Get current user ID - for now using a mock user ID
  const currentUserId = "user-1";

  // Mutation for saving user strain experiences
  const saveExperienceMutation = useMutation({
    mutationFn: async (experienceData: Partial<InsertUserStrainExperience>) => {
      const fullData: InsertUserStrainExperience = {
        userId: currentUserId,
        strainId: strain.id,
        liked: null,
        notes: null,
        ...experienceData,
      };
      return await apiRequest('POST', '/api/user-strain-experiences', fullData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-strain-experiences'] });
    },
    onError: (error: any) => {
      console.error('Error saving experience:', error);
      toast({
        title: "Error",
        description: "Failed to save your experience. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLike = () => {
    const newLiked = liked === true ? null : true;
    console.log(`Like toggled for ${strain.name}: ${liked} -> ${newLiked}`);
    setLiked(newLiked);
    saveExperienceMutation.mutate({ liked: newLiked, notes: notes || null });
  };

  const handleDislike = () => {
    const newLiked = liked === false ? null : false;
    console.log(`Dislike toggled for ${strain.name}: ${liked} -> ${newLiked}`);
    setLiked(newLiked);
    saveExperienceMutation.mutate({ liked: newLiked, notes: notes || null });
  };

  const handleSave = () => {
    const newSaved = !saved;
    console.log(`${saved ? 'Unsaved' : 'Saved'} strain: ${strain.name}`);
    setSaved(newSaved);
    saveExperienceMutation.mutate({ liked, saved: newSaved, notes: notes || null });
    toast({
      title: newSaved ? "Strain Saved" : "Strain Removed",
      description: newSaved ? "Added to your saved strains." : "Removed from your saved strains.",
    });
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    console.log(`Notes updated for ${strain.name}: ${value}`);
  };

  const handleSaveNotes = () => {
    saveExperienceMutation.mutate({ liked, saved, notes: notes || null });
    toast({
      title: "Notes Saved",
      description: "Your notes have been saved successfully.",
    });
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
            <Button
              size="sm"
              onClick={handleSaveNotes}
              disabled={saveExperienceMutation.isPending}
              className="w-full"
              data-testid={`button-save-notes-${strain.id}`}
            >
              {saveExperienceMutation.isPending ? "Saving..." : "Save Notes"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}