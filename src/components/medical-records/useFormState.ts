
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { MedicalRecord } from "./types";

export interface FormData {
  fullName: string;
  bloodGroup: string;
  age: string;
  sex: string;
  maritalStatus: string;
  dateOfBirth: string;
  weight: string;
  primaryPhysician: string;
  healthInsurance: string;
  advanceDirectives: string;
  organDonor: string;
  language: string;
  address: string;
  recentHospitalizations: string;
  allergies: string;
  conditions: string;
  medications: string;
  medicationDosage: string;
  emergencyContact: string;
  emergencyPhone: string;
  notes: string;
  genotype: string;
  hivStatus: string;
  hepatitisStatus: string;
}

const generateEmergencyCode = (): string => {
  const alphanumeric = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const numeric = '0123456789';
  
  let code = 'EM-';
  
  for (let i = 0; i < 2; i++) {
    code += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
  }
  
  code += '-';
  
  for (let i = 0; i < 4; i++) {
    code += numeric.charAt(Math.floor(Math.random() * numeric.length));
  }
  
  return code;
};

export const useFormState = (initialData?: MedicalRecord, onSave?: (record: MedicalRecord) => void, onClose?: () => void) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    bloodGroup: "",
    age: "",
    sex: "",
    maritalStatus: "",
    dateOfBirth: "",
    weight: "",
    primaryPhysician: "",
    healthInsurance: "",
    advanceDirectives: "",
    organDonor: "",
    language: "",
    address: "",
    recentHospitalizations: "",
    allergies: "",
    conditions: "",
    medications: "",
    medicationDosage: "",
    emergencyContact: "",
    emergencyPhone: "",
    notes: "",
    genotype: "",
    hivStatus: "",
    hepatitisStatus: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName,
        bloodGroup: initialData.bloodGroup,
        age: initialData.age || "",
        sex: initialData.sex || "",
        maritalStatus: initialData.maritalStatus || "",
        dateOfBirth: initialData.dateOfBirth || "",
        weight: initialData.weight || "",
        primaryPhysician: initialData.primaryPhysician || "",
        healthInsurance: initialData.healthInsurance || "",
        advanceDirectives: initialData.advanceDirectives || "",
        organDonor: initialData.organDonor || "",
        language: initialData.language || "",
        address: initialData.address || "",
        recentHospitalizations: initialData.recentHospitalizations || "",
        allergies: initialData.allergies || "",
        conditions: initialData.conditions || "",
        medications: initialData.medications || "",
        medicationDosage: initialData.medicationDosage || "",
        emergencyContact: initialData.emergencyContact || "",
        emergencyPhone: initialData.emergencyPhone || "",
        notes: initialData.notes || "",
        genotype: initialData.genotype || "",
        hivStatus: initialData.hivStatus || "",
        hepatitisStatus: initialData.hepatitisStatus || ""
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedRecord: MedicalRecord = initialData ? 
        {
          ...initialData,
          ...formData,
        } : 
        {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
          emergencyCode: generateEmergencyCode()
        };

      if (onSave) {
        onSave(updatedRecord);
      }
      
      toast({
        title: "Success",
        description: initialData ? "Medical record updated successfully." : "Medical record saved successfully.",
      });
      
      if (!initialData) {
        setFormData({
          fullName: "",
          bloodGroup: "",
          age: "",
          sex: "",
          maritalStatus: "",
          dateOfBirth: "",
          weight: "",
          primaryPhysician: "",
          healthInsurance: "",
          advanceDirectives: "",
          organDonor: "",
          language: "",
          address: "",
          recentHospitalizations: "",
          allergies: "",
          conditions: "",
          medications: "",
          medicationDosage: "",
          emergencyContact: "",
          emergencyPhone: "",
          notes: "",
          genotype: "",
          hivStatus: "",
          hepatitisStatus: ""
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
