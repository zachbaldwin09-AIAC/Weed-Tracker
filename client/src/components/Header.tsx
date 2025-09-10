import { Leaf, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-2">
        <Leaf className="w-6 h-6 text-primary" data-testid="logo-icon" />
        <h1 className="text-lg font-semibold text-foreground" data-testid="app-title">
          Weed Tracker
        </h1>
      </div>
      <Button 
        size="icon" 
        variant="ghost"
        onClick={() => console.log('Profile clicked')}
        data-testid="button-profile"
      >
        <User className="w-5 h-5" />
      </Button>
    </header>
  );
}