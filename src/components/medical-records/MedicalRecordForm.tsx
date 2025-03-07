
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { FormHeader } from "./FormHeader";
import { FormField } from "./FormField";
import { FormActions } from "./FormActions";

// Define the medical record type
export interface MedicalRecord {
  id: string;
  fullName: string;
  bloodGroup: string;
  allergies: string;
  conditions: string;
  medications: string;
  emergencyContact: string;
  emergencyPhone: string;
  notes: string;
  createdAt: string;
}

export interface MedicalRecordFormProps { 
  onClose: () => void;
  onSave?: (record: MedicalRecord) => void;
  initialData?: MedicalRecord;
}

export function MedicalRecordForm({ onClose, onSave, initialData }: MedicalRecordFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    bloodGroup: "",
    allergies: "",
    conditions: "",
    medications: "",
    emergencyContact: "",
    emergencyPhone: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Load initial data if provided (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName,
        bloodGroup: initialData.bloodGroup,
        allergies: initialData.allergies || "",
        conditions: initialData.conditions || "",
        medications: initialData.medications || "",
        emergencyContact: initialData.emergencyContact || "",
        emergencyPhone: initialData.emergencyPhone || "",
        notes: initialData.notes || ""
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.bloodGroup) {
      toast({
        title: "Error",
        description: "Please enter at least full name and blood group.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // In a real app, this would save to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const updatedRecord: MedicalRecord = initialData ? 
        {
          ...initialData,
          ...formData,
        } : 
        {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString()
        };

      // Call the onSave callback if provided
      if (onSave) {
        onSave(updatedRecord);
      }
      
      toast({
        title: "Success",
        description: initialData ? "Medical record updated successfully." : "Medical record saved successfully.",
      });
      
      if (!initialData) {
        // Only reset form if not editing
        setFormData({
          fullName: "",
          bloodGroup: "",
          allergies: "",
          conditions: "",
          medications: "",
          emergencyContact: "",
          emergencyPhone: "",
          notes: ""
        });
      }
      
      onClose();
    } catch (error) {
      console.error("Error saving medical record:", error);
      toast({
        title: "Error",
        description: "Failed to save medical record.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-t">
      <FormHeader onClose={onClose} title={initialData ? "Edit Medical Record" : "Add Medical Record"} />
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <FormField
          id="fullName"
          label="Full Name"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />
        
        <FormField
          id="bloodGroup"
          label="Blood Group"
          placeholder="Blood Group (e.g., A+, O-, AB+)"
          value={formData.bloodGroup}
          onChange={handleInputChange}
          required
        />
        
        <FormField
          id="allergies"
          label="Allergies"
          placeholder="Known allergies"
          value={formData.allergies}
          onChange={handleInputChange}
        />
        
        <FormField
          id="conditions"
          label="Medical Conditions"
          placeholder="Existing medical conditions"
          value={formData.conditions}
          onChange={handleInputChange}
        />
        
        <FormField
          id="medications"
          label="Current Medications"
          placeholder="Current medications"
          value={formData.medications}
          onChange={handleInputChange}
        />
        
        <FormField
          id="emergencyContact"
          label="Emergency Contact"
          placeholder="Emergency contact name"
          value={formData.emergencyContact}
          onChange={handleInputChange}
        />
        
        <FormField
          id="emergencyPhone"
          label="Emergency Phone"
          placeholder="Emergency contact phone"
          value={formData.emergencyPhone}
          onChange={handleInputChange}
        />
        
        <FormField
          id="notes"
          label="Additional Notes"
          placeholder="Any other important medical information..."
          value={formData.notes}
          onChange={handleInputChange}
          multiline
        />
        
        <FormActions loading={loading} isEditing={!!initialData} />
      </form>
    </div>
  );
}

export default MedicalRecordForm;
