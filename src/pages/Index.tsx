
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import EmergencyInput from "@/components/EmergencyInput";
import GuidanceDisplay from "@/components/GuidanceDisplay";
import UserSidebar from "@/components/UserSidebar";
import useEmergencyData from "@/hooks/useEmergencyData";
import Icons from "@/components/Icons";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { MedicalRecord } from "@/components/medical-records/types";

const Index = () => {
  const [emergency, setEmergency] = useState("");
  const [guidance, setGuidance] = useState("");
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState<Record<string, string>>({});
  const [searchCount, setSearchCount] = useState(() => {
    const savedCount = localStorage.getItem("emergencySearchCount");
    return savedCount ? parseInt(savedCount, 0) : 0;
  });
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<MedicalRecord | null>(null);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { 
    data, 
    loading, 
    addEmergencyEntry, 
    requestGuidance,
    addMedicalRecord,
    editMedicalRecord,
    deleteMedicalRecord
  } = useEmergencyData();

  const isAdmin = isAuthenticated && user?.email === "test@example.com";

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (guidance && !showFollowUp) {
      timer = setTimeout(() => {
        setShowFollowUp(true);
      }, 8000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [guidance, showFollowUp]);

  useEffect(() => {
    localStorage.setItem("emergencySearchCount", searchCount.toString());
    
    if (!isAuthenticated && searchCount === 2) {
      setShowSignInPrompt(true);
    }
  }, [searchCount, isAuthenticated]);

  // Select the first medical record by default if user is authenticated
  useEffect(() => {
    if (isAuthenticated && data.medicalRecords?.length > 0 && !selectedMedicalRecord) {
      setSelectedMedicalRecord(data.medicalRecords[0]);
    }
  }, [isAuthenticated, data.medicalRecords, selectedMedicalRecord]);

  const handleEmergencySubmit = async (text: string) => {
    setEmergency(text);
    setAdditionalInfo({}); // Reset additional info when new search is submitted
    
    try {
      const guidanceText = await requestGuidance(text);
      setGuidance(guidanceText);
      
      if (!isAuthenticated) {
        setSearchCount(prev => prev + 1);
      }
      
      const emergencyTitle = text.split('\n')[0];
      addEmergencyEntry(emergencyTitle, guidanceText);
      
    } catch (error) {
      console.error("Error getting guidance:", error);
      toast({
        title: "Error",
        description: "Unable to get guidance. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setEmergency("");
    setGuidance("");
    setShowFollowUp(false);
    setAdditionalInfo({});
  };

  const handleFollowUpSubmit = (additionalDetails: Record<string, string>) => {
    if (Object.keys(additionalDetails).length > 0) {
      // Store the additional info for display
      setAdditionalInfo(additionalDetails);
      
      let updatedEmergency = emergency;
      
      updatedEmergency += "\n\nAdditional Information:";
      for (const [question, answer] of Object.entries(additionalDetails)) {
        if (answer.trim()) {
          updatedEmergency += `\n- ${question}: ${answer}`;
        }
      }
      
      setEmergency(updatedEmergency);
      
      const emergencyTitle = emergency.split('\n')[0];
      addEmergencyEntry(emergencyTitle, guidance, additionalDetails);
      
      toast({
        title: "Information updated",
        description: "The additional details have been saved and added to your guidance.",
      });
    }
    
    setShowFollowUp(false);
  };

  const handleSelectHistoryEntry = (entry: any) => {
    setEmergency(entry.emergency);
    setGuidance(entry.guidance);
    setAdditionalInfo(entry.additionalInfo || {});
    setShowFollowUp(false);
    
    toast({
      title: "Previous search loaded",
      description: `Loaded: "${entry.emergency}"`,
    });
  };

  const handleSaveMedicalRecord = (record: MedicalRecord) => {
    addMedicalRecord(record);
    setSelectedMedicalRecord(record);
    
    toast({
      title: "Medical record saved",
      description: "Your medical information has been saved successfully.",
    });
  };

  const handleSelectMedicalRecord = (record: MedicalRecord) => {
    setSelectedMedicalRecord(record);
    
    toast({
      title: "Medical record selected",
      description: `Selected: "${record.fullName}"`,
    });
  };

  const closeSignInPrompt = () => {
    setShowSignInPrompt(false);
  };

  // Prepare personalized medical information if a record is selected
  const personalizedInfo = selectedMedicalRecord ? {
    medicalConditions: selectedMedicalRecord.conditions ? selectedMedicalRecord.conditions.split(',').map(c => c.trim()) : [],
    bloodGroup: selectedMedicalRecord.bloodGroup,
    genotype: selectedMedicalRecord.genotype,
    hivStatus: selectedMedicalRecord.hivStatus,
    hepatitisStatus: selectedMedicalRecord.hepatitisStatus,
  } : undefined;

  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      <UserSidebar 
        history={data.history} 
        medicalRecords={data.medicalRecords || []}
        onSelectEntry={handleSelectHistoryEntry}
        onSaveMedicalRecord={handleSaveMedicalRecord}
        onEditMedicalRecord={editMedicalRecord}
        onDeleteMedicalRecord={deleteMedicalRecord}
        onSelectMedicalRecord={handleSelectMedicalRecord}
        selectedRecordId={selectedMedicalRecord?.id}
      />
      
      <div className="container max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <Icons.emergency className="mr-2 h-6 w-6 text-emergency" />
            <span className="hidden xs:inline">Aid-On: Medical Guidance Assistant</span>
            <span className="xs:hidden">Aid-On</span>
          </h1>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:block">
                  Welcome, {user?.name}
                </span>
                {isAdmin && (
                  <Link to="/ai-training">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Icons.brain className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">AI Training</span>
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Icons.login className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        <EmergencyInput 
          onSubmit={handleEmergencySubmit} 
          isLoading={loading} 
          className="mb-6"
          showFollowUp={showFollowUp}
          emergencyText={emergency}
          onFollowUpSubmit={handleFollowUpSubmit}
        />
        
        {guidance && (
          <GuidanceDisplay 
            guidance={guidance} 
            onReset={handleReset} 
            className="mb-6"
            additionalInfo={additionalInfo}
            personalizedInfo={personalizedInfo}
          />
        )}
        
        <footer className="text-xs text-center text-muted-foreground mt-8">
          <p>Aid-On is for informational purposes only and is not a substitute for professional medical advice.</p>
          <p className="mt-1">Always call emergency services for serious medical situations.</p>
        </footer>
      </div>

      <Dialog open={showSignInPrompt} onOpenChange={closeSignInPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Icons.emergency className="mr-2 h-5 w-5 text-emergency" />
              Create an Aid-On Account
            </DialogTitle>
            <DialogDescription>
              Sign in to save your emergency history, store medical information, and access additional features.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">
              With an account, you can:
            </p>
            <ul className="mt-2 ml-6 text-sm list-disc space-y-1">
              <li>Save your search history for quick access</li>
              <li>Store important medical information</li>
              <li>Access your data from any device</li>
              <li>Help improve Aid-On's emergency guidance</li>
            </ul>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Link to="/register" className="w-full sm:w-auto">
              <Button className="w-full bg-emergency hover:bg-emergency-hover text-emergency-foreground">
                <Icons.user className="mr-2 h-4 w-4" />
                Create Account
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                <Icons.login className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
