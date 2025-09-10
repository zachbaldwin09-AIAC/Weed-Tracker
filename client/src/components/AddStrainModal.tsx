import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertStrain } from "@shared/schema";

interface AddStrainModalProps {
  onStrainAdded: () => void;
}

export function AddStrainModal({ onStrainAdded }: AddStrainModalProps) {
  const [open, setOpen] = useState(false);
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

  const handleSubmit = async (strainData: InsertStrain) => {
    console.log('Strain data:', strainData);
    addStrainMutation.mutate(strainData);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="h-10 w-10 rounded-full"
          size="icon"
          data-testid="button-add-strain-fab"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]" data-testid="dialog-add-strain-modal">
        <DialogHeader>
          <DialogTitle>Add New Strain</DialogTitle>
          <DialogDescription>
            Add a new strain to your collection with manual entry.
          </DialogDescription>
        </DialogHeader>
        
        <AddStrainForm
          onSubmit={handleSubmit}
          isLoading={addStrainMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}