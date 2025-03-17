
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { MedicalRecord } from "./types";

export interface FormData {
  fullName: string;
  bloodGroup: string;
  age: string;
  sex: string;
  allergies: string;
  conditions: string;
  medications: string;
  emergencyContact: string;
  emergencyPhone: string;
  notes: string;
}

export const useFormState = (initialData?: MedicalRecord, onSave?: (record: MedicalRecord) => void, onClose?: () => void) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    bloodGroup: "",
    age: "",
    sex: "",
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
        age: initialData.age || "",
        sex: initialData.sex || "",
        allergies: initialData.allergies || "",
        conditions: initialData.conditions || "",
        medications: initialData.medications || "",
        emergencyContact: initialData.emergencyContact || "",
        emergencyPhone: initialData.emergencyPhone || "",
        notes: initialData.notes || ""
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
          age: "",
          sex: "",
          allergies: "",
          conditions: "",
          medications: "",
          emergencyContact: "",
          emergencyPhone: "",
          notes: ""
        });
      }
      
      if (onClose) onClose();
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

  return {
    formData,
    loading,
    handleInputChange,
    handleSubmit
  };
};
