import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import MedicalRecordForm, { MedicalRecord } from "@/components/medical-records/MedicalRecordForm";
import MedicalRecordsList from "@/components/MedicalRecordsList";
import useEmergencyData from "@/hooks/useEmergencyData";
import Icons from "@/components/Icons";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import QRCodeGenerator from "@/components/QRCodeGenerator";

const MedicalRecords = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { 
    data, 
    addMedicalRecord, 
    editMedicalRecord,
    deleteMedicalRecord,
  } = useEmergencyData();

  const handleSaveMedicalRecord = (record: MedicalRecord) => {
    addMedicalRecord(record);
    setShowForm(false);
    
    toast({
      title: "Medical record saved",
      description: "Your medical information has been saved successfully.",
    });
  };
  
  const handleEditMedicalRecord = (record: MedicalRecord) => {
    editMedicalRecord(record);
    setEditingRecord(null);
    
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

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen transition-colors duration-300 relative p-4">
      <div className="container max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <Icons.medicalRecords className="mr-2 h-6 w-6 text-primary" />
            Medical Records Portal
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden md:inline">
              Welcome, {user?.name}
            </span>
            <Button variant="outline" size="sm" onClick={goToHome} className="mr-2">
              <Icons.back className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              <Icons.logout className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {showForm || editingRecord ? (
          <Card className="mb-6 p-4">
            <MedicalRecordForm 
              onClose={() => {
                setShowForm(false);
                setEditingRecord(null);
              }} 
              onSave={editingRecord ? handleEditMedicalRecord : handleSaveMedicalRecord}
              initialData={editingRecord || undefined}
            />
          </Card>
        ) : (
          <div className="flex gap-3 mb-6">
            <Button 
              onClick={() => setShowForm(true)}
            >
              <Icons.medicalRecords className="mr-2 h-4 w-4" />
              Add New Medical Record
            </Button>
            
            {data.medicalRecords && data.medicalRecords.length > 0 && (
              <QRCodeGenerator medicalRecord={data.medicalRecords[0]} />
            )}
          </div>
        )}

        {data.medicalRecords && data.medicalRecords.length > 0 ? (
          <Card>
            <MedicalRecordsList 
              records={data.medicalRecords} 
              onClose={() => {}} 
              onDelete={handleDeleteMedicalRecord}
              onEdit={(record) => setEditingRecord(record)}
            />
          </Card>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No medical records available</p>
            <p className="mt-2">Click the button above to add your first record</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
