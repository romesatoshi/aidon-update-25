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
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const Index = () => {
  const [emergency, setEmergency] = useState("");
  const [guidance, setGuidance] = useState("");
  const [showFollowUp, setShowFollowUp] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { 
    data, 
    loading, 
    addEmergencyEntry, 
    requestGuidance,
    addMedicalRecord,
    editMedicalRecord,
    deleteMedicalRecord
  } = useEmergencyData();

  const handleEmergencySubmit = async (text: string) => {
    setEmergency(text);
    
    try {
      const guidanceText = await requestGuidance(text);
      setGuidance(guidanceText);
      
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
    if (Object.keys(additionalInfo).length > 0) {
      let updatedEmergency = emergency;
      
      updatedEmergency += "\n\nAdditional Information:";
      for (const [question, answer] of Object.entries(additionalInfo)) {
        if (answer.trim()) {
          updatedEmergency += `\n- ${question}: ${answer}`;
        }
      }
      
      setEmergency(updatedEmergency);
      
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

  const handleSaveMedicalRecord = (record: any) => {
    addMedicalRecord(record);
    
    toast({
      title: "Medical record saved",
      description: "Your medical information has been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      <UserSidebar 
        history={data.history} 
        medicalRecords={data.medicalRecords || []}
        onSelectEntry={handleSelectHistoryEntry}
        onSaveMedicalRecord={handleSaveMedicalRecord}
        onEditMedicalRecord={editMedicalRecord}
        onDeleteMedicalRecord={deleteMedicalRecord}
      />
      
      <div className="container max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <Icons.emergency className="mr-2 h-6 w-6 text-emergency" />
            <span className="hidden xs:inline">{t('app.title')}</span>
            <span className="xs:hidden">{t('app.title.short')}</span>
          </h1>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            {isAuthenticated ? (
              <span className="text-sm text-muted-foreground hidden sm:block">
                <Link to="/medical-records">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Icons.medicalRecords className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">{user?.name}</span>
                  </Button>
                </Link>
              </span>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Icons.login className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">{t('app.signin')}</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        {isAuthenticated && (
          <div className="mb-4 text-center">
            <p className="text-sm text-muted-foreground">
              {t('app.welcome')}, {user?.name}
            </p>
          </div>
        )}
        
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
          <p>{t('app.footer.disclaimer')}</p>
          <p className="mt-1">{t('app.footer.emergency')}</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
