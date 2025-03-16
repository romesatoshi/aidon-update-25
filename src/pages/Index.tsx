import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import EmergencyInput from "@/components/EmergencyInput";
import GuidanceDisplay from "@/components/GuidanceDisplay";
import UserSidebar from "@/components/UserSidebar";
import useEmergencyData from "@/hooks/useEmergencyData";
import Icons from "@/components/Icons";
import { type MedicalRecord } from "@/components/medical-records/MedicalRecordForm";

const Index = () => {
  const [emergency, setEmergency] = useState("");
  const [guidance, setGuidance] = useState("");
  const { toast } = useToast();
  const { 
    data, 
    loading, 
    addEmergencyEntry, 
    addMedicalRecord, 
    editMedicalRecord,
    deleteMedicalRecord,
    requestGuidance 
  } = useEmergencyData();

  const handleEmergencySubmit = async (text: string) => {
    setEmergency(text);
    
    try {
      const guidanceText = await requestGuidance(text);
      setGuidance(guidanceText);
      
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
  };

  const handleSelectHistoryEntry = (entry: any) => {
    setEmergency(entry.emergency);
    setGuidance(entry.guidance);
    
    toast({
      title: "Previous search loaded",
      description: `Loaded: "${entry.emergency}"`,
    });
  };

  const handleSaveMedicalRecord = (record: MedicalRecord) => {
    addMedicalRecord(record);
    
    toast({
      title: "Medical record saved",
      description: "Your medical information has been saved successfully.",
    });
  };
  
  const handleEditMedicalRecord = (record: MedicalRecord) => {
    editMedicalRecord(record);
    
    toast({
      title: "Medical record updated",
      description: "Your medical information has been updated successfully.",
    });
  };
  
  const handleDeleteMedicalRecord = (id: string) => {
    deleteMedicalRecord(id);
    
    toast({
      title: "Medical record deleted",
      description: "Your medical record has been deleted successfully.",
    });
  };

  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      <UserSidebar 
        history={data.history} 
        medicalRecords={data.medicalRecords || []}
        onSelectEntry={handleSelectHistoryEntry}
        onSaveMedicalRecord={handleSaveMedicalRecord}
        onEditMedicalRecord={handleEditMedicalRecord}
        onDeleteMedicalRecord={handleDeleteMedicalRecord}
      />
      
      <div className="container max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <Icons.Emergency className="mr-2 h-6 w-6 text-emergency" />
            Emergency First Aid Helper
          </h1>
        </div>
        
        <EmergencyInput 
          onSubmit={handleEmergencySubmit} 
          isLoading={loading} 
          className="mb-6"
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
