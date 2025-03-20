
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useEmergencyData } from "@/hooks/useEmergencyData";
import Icons from "@/components/Icons";
import MedicalRecordsList from "@/components/MedicalRecordsList";
import MedicalRecordForm from "@/components/medical-records/MedicalRecordForm";
import AITestingPanel from "@/components/medical-records/AITestingPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <Icons.medicalRecords className="mr-2 h-6 w-6" />
              Medical Records Portal
            </h1>
            
            <div className="flex items-center space-x-2">
              <Link to="/">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Icons.back className="mr-1 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout} className="flex items-center">
                <Icons.logout className="mr-1 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
          
          <p className="text-muted-foreground">
            Manage your personal medical information for easier emergency response
          </p>
        </header>
        
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
              <section>
                <div className="border rounded-lg overflow-hidden bg-card">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h2 className="text-lg font-medium flex items-center">
                      <Icons.medicalRecords className="mr-2 h-5 w-5" />
                      Your Medical Records
                    </h2>
                    <Button 
                      onClick={handleAddRecord}
                      size="sm"
                      className="flex items-center"
                    >
                      <Icons.plus className="mr-1 h-4 w-4" />
                      Add Record
                    </Button>
                  </div>
                  
                  {showAddForm ? (
                    <MedicalRecordForm
                      onClose={handleFormClose}
                      onSave={handleSaveRecord}
                      initialData={isEditing ? recordToEdit : undefined}
                    />
                  ) : isLoading ? (
                    <div className="flex justify-center items-center p-8">
                      <Icons.loader className="h-8 w-8 animate-spin" />
                    </div>
                  ) : medicalRecords && medicalRecords.length > 0 ? (
                    <MedicalRecordsList 
                      records={medicalRecords} 
                      onEdit={handleEdit} 
                      onDelete={handleDelete}
                      onClose={handleClose} 
                    />
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground mb-4">You don't have any medical records yet.</p>
                      <Button onClick={handleAddRecord} className="flex items-center mx-auto">
                        <Icons.plus className="mr-1 h-4 w-4" />
                        Create Medical Record
                      </Button>
                    </div>
                  )}
                </div>
              </section>
            </TabsContent>
            
            <TabsContent value="aitest" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AITestingPanel onTestComplete={handleAITestComplete} />
                
                <div className="border rounded-lg overflow-hidden bg-card">
                  <div className="px-4 py-3 border-b">
                    <h2 className="text-lg font-medium flex items-center">
                      <Icons.history className="mr-2 h-5 w-5" />
                      Recent AI Test Results
                    </h2>
                  </div>
                  
                  <div className="p-4">
                    {aiTestResults.length > 0 ? (
                      <div className="space-y-4">
                        {aiTestResults.map((result, index) => (
                          <div key={index} className="border rounded-md p-3">
                            <div className="flex justify-between">
                              <span className="text-xs text-muted-foreground">Test #{index + 1}</span>
                              <span className="text-xs font-medium text-primary">
                                {result.accuracy.toFixed(1)}% accurate
                              </span>
                            </div>
                            <p className="text-sm font-medium mt-2 mb-1">Query:</p>
                            <p className="text-xs text-muted-foreground mb-2">{result.input}</p>
                            <p className="text-sm font-medium mb-1">Response:</p>
                            <p className="text-xs text-muted-foreground">{result.output}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground text-sm">No test results yet</p>
                        <p className="text-xs mt-1">Test the AI to see results here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default MedicalRecords;
