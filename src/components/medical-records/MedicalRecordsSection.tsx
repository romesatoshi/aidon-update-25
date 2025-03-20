
import React from "react";
import Icons from "@/components/Icons";
import { Button } from "@/components/ui/button";
import MedicalRecordsList from "@/components/MedicalRecordsList";
import MedicalRecordForm from "@/components/medical-records/MedicalRecordForm";

interface MedicalRecordsSectionProps {
  isLoading: boolean;
  showAddForm: boolean;
  isEditing: boolean;
  recordToEdit: any;
  medicalRecords: any[];
  onAddRecord: () => void;
  onFormClose: () => void;
  onSaveRecord: (record: any) => void;
  onEdit: (record: any) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const MedicalRecordsSection: React.FC<MedicalRecordsSectionProps> = ({
  isLoading,
  showAddForm,
  isEditing,
  recordToEdit,
  medicalRecords,
  onAddRecord,
  onFormClose,
  onSaveRecord,
  onEdit,
  onDelete,
  onClose,
}) => {
  return (
    <section>
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-medium flex items-center">
            <Icons.medicalRecords className="mr-2 h-5 w-5" />
            Your Medical Records
          </h2>
          <Button 
            onClick={onAddRecord}
            size="sm"
            className="flex items-center"
          >
            <Icons.plus className="mr-1 h-4 w-4" />
            Add Record
          </Button>
        </div>
        
        {showAddForm ? (
          <MedicalRecordForm
            onClose={onFormClose}
            onSave={onSaveRecord}
            initialData={isEditing ? recordToEdit : undefined}
          />
        ) : isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Icons.loader className="h-8 w-8 animate-spin" />
          </div>
        ) : medicalRecords && medicalRecords.length > 0 ? (
          <MedicalRecordsList 
            records={medicalRecords} 
            onEdit={onEdit} 
            onDelete={onDelete}
            onClose={onClose} 
          />
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground mb-4">You don't have any medical records yet.</p>
            <Button onClick={onAddRecord} className="flex items-center mx-auto">
              <Icons.plus className="mr-1 h-4 w-4" />
              Create Medical Record
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MedicalRecordsSection;
