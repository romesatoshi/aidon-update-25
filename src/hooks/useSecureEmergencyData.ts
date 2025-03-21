
import { useState, useEffect } from "react";
import { MedicalRecord } from "@/components/medical-records/types";
import { secureLocalStorage } from "@/utils/encryption";

interface EmergencyEntry {
  id: string;
  timestamp: string;
  emergency: string;
  guidance: string;
  additionalInfo?: Record<string, string>;
}

interface EmergencyData {
  history: EmergencyEntry[];
  medicalRecords: MedicalRecord[];
}

export const useSecureEmergencyData = () => {
  const [data, setData] = useState<EmergencyData>({ history: [], medicalRecords: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        // Load data from secure localStorage
        const savedHistory = secureLocalStorage.getItem("emergencyHistory");
        const savedRecords = secureLocalStorage.getItem("medicalRecords");

        setData({
          history: savedHistory || [],
          medicalRecords: savedRecords || [],
        });
      } catch (error) {
        console.error("Error loading emergency data:", error);
        // Initialize with empty data if there's an error
        setData({ history: [], medicalRecords: [] });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const saveData = (newData: EmergencyData) => {
    try {
      secureLocalStorage.setItem("emergencyHistory", newData.history);
      secureLocalStorage.setItem("medicalRecords", newData.medicalRecords);
      setData(newData);
    } catch (error) {
      console.error("Error saving emergency data:", error);
    }
  };

  const addEmergencyEntry = (emergency: string, guidance: string, additionalInfo?: Record<string, string>) => {
    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      emergency,
      guidance,
      additionalInfo,
    };

    const newData = {
      ...data,
      history: [newEntry, ...data.history].slice(0, 50), // Keep only the latest 50 entries
    };

    saveData(newData);
  };

  const requestGuidance = async (text: string) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call to a backend service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, return a mock response
      const response = `Based on the information provided for "${text}", here are the recommended steps:

1. Ensure the person is in a safe position
2. Check for breathing and consciousness
3. If needed, call emergency services immediately
4. If trained, provide appropriate first aid while waiting
5. Document any changes in condition`;

      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      console.error("Error requesting guidance:", error);
      throw new Error("Failed to get guidance. Please try again.");
    }
  };

  const addMedicalRecord = (record: MedicalRecord) => {
    const newData = {
      ...data,
      medicalRecords: [...data.medicalRecords, record],
    };
    saveData(newData);
  };

  const editMedicalRecord = (updatedRecord: MedicalRecord) => {
    const newRecords = data.medicalRecords.map(record => 
      record.id === updatedRecord.id ? updatedRecord : record
    );
    
    const newData = {
      ...data,
      medicalRecords: newRecords,
    };
    
    saveData(newData);
  };

  const deleteMedicalRecord = (id: string) => {
    const newRecords = data.medicalRecords.filter(record => record.id !== id);
    
    const newData = {
      ...data,
      medicalRecords: newRecords,
    };
    
    saveData(newData);
  };

  return {
    data,
    loading,
    addEmergencyEntry,
    requestGuidance,
    addMedicalRecord,
    editMedicalRecord,
    deleteMedicalRecord,
  };
};

export default useSecureEmergencyData;
