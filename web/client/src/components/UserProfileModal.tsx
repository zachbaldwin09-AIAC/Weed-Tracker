import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UserProfileModalProps {
  userId: string;
  children: React.ReactNode;
}

export function UserProfileModal({ userId, children }: UserProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const { toast } = useToast();

  // Query to fetch user profile - using default getQueryFn for consistency
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['/api/users', userId],
    enabled: isOpen,
  });

  // Set initial display name when profile loads or modal opens
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || "");
    }
  }, [userProfile]);

  // Reset form when modal opens to ensure fresh data
  useEffect(() => {
    if (isOpen && userProfile) {
      setDisplayName(userProfile.displayName || "");
    }
  }, [isOpen, userProfile]);

  // Mutation to update user profile
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: { displayName: string }) => {
      return await apiRequest('PATCH', `/api/users/${userId}`, {
        displayName: profileData.displayName || null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      setIsOpen(false);
      toast({
        title: "Profile Updated",
        description: "Your display name has been saved successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ displayName: displayName.trim() });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" data-testid="dialog-user-profile">
        <DialogHeader>
          <DialogTitle data-testid="text-profile-title">User Profile</DialogTitle>
          <DialogDescription>
            Set your display name for the app. This is how you'll be identified.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="displayName" className="text-right">
                Display Name
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="col-span-3"
                placeholder="Enter your name"
                maxLength={50}
                disabled={isLoading || updateProfileMutation.isPending}
                data-testid="input-display-name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading || updateProfileMutation.isPending}
              data-testid="button-save-profile"
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}