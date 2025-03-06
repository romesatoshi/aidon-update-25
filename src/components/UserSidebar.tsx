
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { EmergencyEntry } from "@/hooks/useEmergencyData";
import Icons from "./Icons";
import ThemeToggle from "./ThemeToggle";
import MedicalRecordForm, { MedicalRecord } from "./MedicalRecordForm";
import MedicalRecordsList from "./MedicalRecordsList";

interface UserSidebarProps {
  history: EmergencyEntry[];
  onSelectEntry: (entry: EmergencyEntry) => void;
  className?: string;
}

export function UserSidebar({ history, onSelectEntry, className }: UserSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [showMedicalRecords, setShowMedicalRecords] = useState(false);
  const [savedRecords, setSavedRecords] = useState<MedicalRecord[]>([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const toggleMedicalForm = () => {
    setShowMedicalForm(!showMedicalForm);
    if (showMedicalRecords) setShowMedicalRecords(false);
  };

  const toggleMedicalRecords = () => {
    setShowMedicalRecords(!showMedicalRecords);
    if (showMedicalForm) setShowMedicalForm(false);
  };

  const handleSaveMedicalRecord = (record: MedicalRecord) => {
    setSavedRecords(prev => [record, ...prev]);
  };

  const calculateContentHeight = () => {
    if (showMedicalForm || showMedicalRecords) {
      return "h-[calc(100%-12rem)]";
    }
    return "h-[calc(100%-8rem)]";
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
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              aria-label="Close sidebar"
            >
              <Icons.Close className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 p-3 border-b">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMedicalForm}
              className={cn(
                "flex-1 flex items-center justify-center gap-2",
                showMedicalForm && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <Icons.MedicalRecords className="h-4 w-4" />
              {showMedicalForm ? "Hide Form" : "Add Record"}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMedicalRecords}
              className={cn(
                "flex-1 flex items-center justify-center gap-2",
                showMedicalRecords && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <Icons.FileText className="h-4 w-4" />
              {showMedicalRecords ? "Hide Records" : "View Records"}
            </Button>
          </div>
        </div>
        
        {showMedicalForm && (
          <MedicalRecordForm 
            onClose={() => setShowMedicalForm(false)} 
            onSave={handleSaveMedicalRecord}
          />
        )}
        
        {showMedicalRecords && (
          <MedicalRecordsList 
            records={savedRecords} 
            onClose={() => setShowMedicalRecords(false)} 
          />
        )}
        
        <ScrollArea className={cn("p-4", calculateContentHeight())}>
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
