import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Plus, PenTool, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddStrainForm } from "./AddStrainForm";
import { PhotoUpload } from "./PhotoUpload";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertStrain } from "@shared/schema";

interface AddStrainModalProps {
  onStrainAdded: () => void;
}

interface ExtractedStrainData {
  name?: string;
  type?: 'Indica' | 'Sativa' | 'Hybrid';
  thcContent?: number;
  description?: string;
  confidence: number;
}

export function AddStrainModal({ onStrainAdded }: AddStrainModalProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'choose' | 'manual' | 'photo'>('choose');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedStrainData | null>(null);
  const { toast } = useToast();

  // Mutation for adding strains
  const addStrainMutation = useMutation({
    mutationFn: async (strainData: InsertStrain) => {
      return await apiRequest('POST', '/api/strains', strainData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/strains'] });
      toast({
        title: "Success",
        description: "Strain added successfully!",
      });
      onStrainAdded();
      handleClose();
    },
    onError: (error: any) => {
      console.error('Error adding strain:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add strain. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mutation for photo analysis
  const analyzePhotoMutation = useMutation({
    mutationFn: async (file: File): Promise<ExtractedStrainData> => {
      const formData = new FormData();
      formData.append('photo', file);
      const response = await apiRequest('POST', '/api/strains/analyze-photo', formData);
      return response as ExtractedStrainData;
    },
    onSuccess: (data: ExtractedStrainData) => {
      console.log('Extracted data:', data);
      setExtractedData(data);
      setMode('manual');
      toast({
        title: "Photo Analysis Complete",
        description: `Extracted strain information with ${Math.round(data.confidence * 100)}% confidence.`,
      });
    },
    onError: (error: any) => {
      console.error('Error analyzing photo:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not extract strain information from photo. Try manual entry instead.",
        variant: "destructive",
      });
      setMode('choose');
    },
  });

  const handleMethodSelect = (method: 'manual' | 'photo') => {
    console.log(`Selected method: ${method}`);
    setMode(method);
  };

  const handleManualSubmit = async (strainData: InsertStrain) => {
    console.log('Manual strain data:', strainData);
    addStrainMutation.mutate(strainData);
  };

  const handlePhotoCapture = async (file: File) => {
    console.log('Photo captured:', file.name);
    analyzePhotoMutation.mutate(file);
  };

  const handleClose = () => {
    setMode('choose');
    setOpen(false);
    setIsProcessing(false);
    setExtractedData(null);
  };

  const handleBack = () => {
    setMode('choose');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="fixed bottom-6 right-4 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
          data-testid="button-add-strain-fab"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]" data-testid="dialog-add-strain-modal">
        {mode === 'choose' && (
          <>
            <DialogHeader>
              <DialogTitle>Add New Strain</DialogTitle>
              <DialogDescription>
                Choose how you'd like to add a new strain to your collection.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 py-4">
              <Button
                variant="outline"
                className="w-full h-16 flex flex-col gap-2"
                onClick={() => handleMethodSelect('manual')}
                data-testid="button-manual-entry"
              >
                <PenTool className="w-5 h-5" />
                <span className="text-sm">Manual Entry</span>
              </Button>
              
              <Button
                variant="outline"
                className="w-full h-16 flex flex-col gap-2"
                onClick={() => handleMethodSelect('photo')}
                data-testid="button-photo-capture"
              >
                <Camera className="w-5 h-5" />
                <span className="text-sm">Photo Capture</span>
              </Button>
            </div>
          </>
        )}
        
        {mode === 'manual' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleBack}
                data-testid="button-back-to-choose"
              >
                ← Back
              </Button>
            </div>
            <AddStrainForm
              onSubmit={handleManualSubmit}
              initialData={extractedData || undefined}
              isLoading={addStrainMutation.isPending}
            />
          </>
        )}
        
        {mode === 'photo' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleBack}
                data-testid="button-back-from-photo"
              >
                ← Back
              </Button>
            </div>
            
            <PhotoUpload
              open={mode === 'photo'}
              onOpenChange={(open) => !open && handleBack()}
              onPhotoCapture={handlePhotoCapture}
              isProcessing={analyzePhotoMutation.isPending}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}