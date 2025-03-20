
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useEmergencyData } from "@/hooks/useEmergencyData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icons from "@/components/Icons";
import PageHeader from "@/components/medical-records/PageHeader";
import MedicalRecordsSection from "@/components/medical-records/MedicalRecordsSection";
import AITestingSection from "@/components/medical-records/AITestingSection";

const MedicalRecords = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { 
    data, 
    loading: isLoading, 
    addMedicalRecord,
    editMedicalRecord,
    deleteMedicalRecord
  } = useEmergencyData();
  const { toast } = useToast();
  const [medicalRecords, setMedicalRecords] = useState(data.medicalRecords || []);
  const [isEditing, setIsEditing] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState("records");
  const [aiTestResults, setAiTestResults] = useState([]);

  useEffect(() => {
    if (data && data.medicalRecords) {
      setMedicalRecords(data.medicalRecords);
    }
  }, [data]);

  const handleEdit = (record) => {
    setIsEditing(true);
    setRecordToEdit(record);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    deleteMedicalRecord(id);
  };

  const handleClose = () => {
    console.log("Medical records list closed");
  };

  const handleAddRecord = () => {
    setIsEditing(false);
    setRecordToEdit(null);
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setIsEditing(false);
    setRecordToEdit(null);
  };

  const handleSaveRecord = (record) => {
    if (isEditing) {
      editMedicalRecord(record);
      toast({
        title: "Medical record updated",
        description: "The medical record has been updated successfully.",
      });
    } else {
      addMedicalRecord(record);
      toast({
        title: "Medical record created",
        description: "The medical record has been created successfully.",
      });
    }
    setShowAddForm(false);
  };

  const handleAITestComplete = (result) => {
    setAiTestResults((prev) => [result, ...prev].slice(0, 5));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          title="Medical Records Portal"
          subtitle="Manage your personal medical information for easier emergency response"
          onLogout={logout}
        />
        
        <main>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="max-w-md">
              <TabsTrigger value="records" className="flex items-center">
                <Icons.file className="mr-1 h-4 w-4" />
                Medical Records
              </TabsTrigger>
              <TabsTrigger value="aitest" className="flex items-center">
                <Icons.brain className="mr-1 h-4 w-4" />
                AI Testing
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="records" className="mt-4">
              <MedicalRecordsSection 
                isLoading={isLoading}
                showAddForm={showAddForm}
                isEditing={isEditing}
                recordToEdit={recordToEdit}
                medicalRecords={medicalRecords}
                onAddRecord={handleAddRecord}
                onFormClose={handleFormClose}
                onSaveRecord={handleSaveRecord}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onClose={handleClose}
              />
            </TabsContent>
            
            <TabsContent value="aitest" className="mt-4">
              <AITestingSection 
                testResults={aiTestResults}
                onTestComplete={handleAITestComplete}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default MedicalRecords;
