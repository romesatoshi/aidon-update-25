
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { EmergencyEntry } from "@/hooks/useEmergencyData";
import Icons from "./Icons";
import ThemeToggle from "./ThemeToggle";
import MedicalRecordForm, { MedicalRecord } from "./medical-records/MedicalRecordForm";
import MedicalRecordsList from "./MedicalRecordsList";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import QRCodeGenerator from "./QRCodeGenerator";

interface UserSidebarProps {
  history: EmergencyEntry[];
  onSelectEntry: (entry: EmergencyEntry) => void;
  medicalRecords: MedicalRecord[];
  onSaveMedicalRecord: (record: MedicalRecord) => void;
  onEditMedicalRecord?: (record: MedicalRecord) => void;
  onDeleteMedicalRecord?: (id: string) => void;
  className?: string;
}

export function UserSidebar({ 
  history, 
  onSelectEntry, 
  medicalRecords, 
  onSaveMedicalRecord,
  onEditMedicalRecord,
  onDeleteMedicalRecord,
  className 
}: UserSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const calculateContentHeight = () => {
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
            <Icons.database className="mr-2 h-4 w-4" />
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
              <Icons.close className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isAuthenticated && (
          <div className="flex flex-col gap-2 p-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {medicalRecords && medicalRecords.length > 0 && (
                  <QRCodeGenerator medicalRecord={medicalRecords[0]} />
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center justify-center gap-1"
              >
                <Icons.logout className="h-4 w-4" />
              </Button>
            </div>
            
            {isAuthenticated && (
              <div className="flex mt-2">
                <Link to="/medical-records" className="w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Icons.medicalRecords className="h-4 w-4" />
                    Medical Portal
                  </Button>
                </Link>
              </div>
            )}
          </div>
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
          <Icons.menu className="h-5 w-5" />
        </Button>
      )}
    </>
  );
}

export default UserSidebar;
