
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { EmergencyEntry } from "@/hooks/useEmergencyData";
import Icons from "./Icons";

interface UserSidebarProps {
  history: EmergencyEntry[];
  onSelectEntry: (entry: EmergencyEntry) => void;
  className?: string;
}

export function UserSidebar({ history, onSelectEntry, className }: UserSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <>
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-80 z-50 transform transition-transform duration-300 ease-in-out shadow-lg border-l border-border glassmorphism overflow-hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
          className
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold flex items-center">
            <Icons.Database className="mr-2 h-4 w-4" />
            Search History
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <Icons.Close className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="h-[calc(100%-4rem)] p-4">
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-md border hover:border-primary cursor-pointer transition-all bg-card"
                  onClick={() => {
                    onSelectEntry(entry);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-sm truncate max-w-[80%]">{entry.emergency}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(entry.timestamp)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{entry.guidance}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No history available</p>
            </div>
          )}
        </ScrollArea>
      </div>
      
      {/* Update the sidebar toggle button to be more visible and use the Menu icon */}
      {!isOpen && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-4 z-40 rounded-full shadow-md bg-background hover:bg-primary hover:text-primary-foreground"
          onClick={() => setIsOpen(true)}
          aria-label="Open history sidebar"
        >
          <Icons.Menu className="h-5 w-5" />
        </Button>
      )}
    </>
  );
}

export default UserSidebar;
