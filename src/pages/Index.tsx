
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import EmergencyInput from "@/components/EmergencyInput";
import GuidanceDisplay from "@/components/GuidanceDisplay";
import UserSidebar from "@/components/UserSidebar";
import useEmergencyData from "@/hooks/useEmergencyData";
import Icons from "@/components/Icons";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [emergency, setEmergency] = useState("");
  const [guidance, setGuidance] = useState("");
  const [showFollowUp, setShowFollowUp] = useState(false);
  const { toast } = useToast();
  const { user, logout, isAuthenticated } = useAuth();
  const { 
    data, 
    loading, 
    addEmergencyEntry, 
    requestGuidance 
  } = useEmergencyData();

  const handleEmergencySubmit = async (text: string) => {
    setEmergency(text);
    
    try {
      const guidanceText = await requestGuidance(text);
      setGuidance(guidanceText);
      
      // After guidance is shown, set showFollowUp to true
      setShowFollowUp(true);
      
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
  };

  const handleFollowUpSubmit = (additionalInfo: Record<string, string>) => {
    // Update the emergency history with the additional information
    if (Object.keys(additionalInfo).length > 0) {
      let updatedEmergency = emergency;
      
      updatedEmergency += "\n\nAdditional Information:";
      for (const [question, answer] of Object.entries(additionalInfo)) {
        if (answer.trim()) {
          updatedEmergency += `\n- ${question}: ${answer}`;
        }
      }
      
      setEmergency(updatedEmergency);
      
      // Could request updated guidance here if needed
      // For now, just update the emergency entry
      const emergencyTitle = emergency.split('\n')[0];
      addEmergencyEntry(emergencyTitle, guidance, additionalInfo);
      
      toast({
        title: "Information updated",
        description: "The additional details have been saved.",
      });
    }
    
    setShowFollowUp(false);
  };

  const handleSelectHistoryEntry = (entry: any) => {
    setEmergency(entry.emergency);
    setGuidance(entry.guidance);
    setShowFollowUp(false);
    
    toast({
      title: "Previous search loaded",
      description: `Loaded: "${entry.emergency}"`,
    });
  };

  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      <UserSidebar 
        history={data.history} 
        medicalRecords={[]}
        onSelectEntry={handleSelectHistoryEntry}
      />
      
      <div className="container max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <Icons.Emergency className="mr-2 h-6 w-6 text-emergency" />
            Medical Guidance Assistant
          </h1>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground hidden md:inline">
                  Welcome, {user?.name}
                </span>
                <Link to="/medical-records">
                  <Button variant="outline" size="sm" className="mr-2">
                    <Icons.MedicalRecords className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Medical Records</span>
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  <Icons.Logout className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  <span>Sign In</span>
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
          />
        )}
        
        <footer className="text-xs text-center text-muted-foreground mt-8">
          <p>This application is for informational purposes only and is not a substitute for professional medical advice.</p>
          <p className="mt-1">Always call emergency services for serious medical situations.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
