
import { useState, useEffect } from 'react';
import { mockUserHistory } from '../lib/mockData';

export interface EmergencyEntry {
  id: string;
  timestamp: string;
  emergency: string;
  guidance: string;
}

export interface EmergencyData {
  history: EmergencyEntry[];
  medicalRecords?: MedicalRecord[];
}

// Matching the MedicalRecord interface already defined in MedicalRecordForm.tsx
interface MedicalRecord {
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

export function useEmergencyData() {
  const [data, setData] = useState<EmergencyData>({ 
    history: [],
    medicalRecords: []
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Load mock data for demonstration
    setData(prev => ({ 
      ...prev, 
      history: mockUserHistory 
    }));
    
    // Load medical records from localStorage if available
    const savedRecords = localStorage.getItem('medicalRecords');
    if (savedRecords) {
      try {
        const records = JSON.parse(savedRecords);
        setData(prev => ({ ...prev, medicalRecords: records }));
      } catch (error) {
        console.error('Error loading medical records:', error);
      }
    }
  }, []);

  const addEmergencyEntry = (emergency: string, guidance: string) => {
    const newEntry: EmergencyEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      emergency,
      guidance
    };
    
    setData(prev => ({
      ...prev,
      history: [newEntry, ...prev.history]
    }));
  };

  const addMedicalRecord = (record: MedicalRecord) => {
    setData(prev => {
      const updatedRecords = [record, ...(prev.medicalRecords || [])];
      
      // Save to localStorage
      localStorage.setItem('medicalRecords', JSON.stringify(updatedRecords));
      
      return {
        ...prev,
        medicalRecords: updatedRecords
      };
    });
  };
  
  const editMedicalRecord = (updatedRecord: MedicalRecord) => {
    setData(prev => {
      const existingRecords = prev.medicalRecords || [];
      const updatedRecords = existingRecords.map(record => 
        record.id === updatedRecord.id ? updatedRecord : record
      );
      
      // Save to localStorage
      localStorage.setItem('medicalRecords', JSON.stringify(updatedRecords));
      
      return {
        ...prev,
        medicalRecords: updatedRecords
      };
    });
  };
  
  const deleteMedicalRecord = (id: string) => {
    setData(prev => {
      const existingRecords = prev.medicalRecords || [];
      const updatedRecords = existingRecords.filter(record => record.id !== id);
      
      // Save to localStorage
      localStorage.setItem('medicalRecords', JSON.stringify(updatedRecords));
      
      return {
        ...prev,
        medicalRecords: updatedRecords
      };
    });
  };

  const requestGuidance = async (emergencyText: string): Promise<string> => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call to a medical AI service
      // For this demo, we'll use improved responses from verified medical sources
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create customized guidance incorporating medical details if available
      let personalizedGuidance = "";
      const currentMedicalRecord = data.medicalRecords?.[0];
      
      if (currentMedicalRecord) {
        const relevantConditions = [];
        
        // Check if the emergency might be related to existing conditions
        if (currentMedicalRecord.conditions && 
            emergencyText.toLowerCase().includes("chest pain") && 
            currentMedicalRecord.conditions.toLowerCase().includes("heart")) {
          relevantConditions.push("heart condition");
        }
        
        if (currentMedicalRecord.allergies && 
            (emergencyText.toLowerCase().includes("rash") || 
             emergencyText.toLowerCase().includes("swelling") || 
             emergencyText.toLowerCase().includes("breathing"))) {
          relevantConditions.push("allergies");
        }
        
        if (relevantConditions.length > 0) {
          personalizedGuidance = `Based on your medical record (${relevantConditions.join(", ")}): `;
        } else {
          personalizedGuidance = "General guidance: ";
        }
      }
      
      // Medical guidance from verified sources (e.g., CDC, AHA, Red Cross guidelines)
      const verifiedGuidance: Record<string, string> = {
        "chest pain": "Call emergency services immediately. Sit the person down in a position that makes breathing comfortable. If aspirin is available and the person isn't allergic, have them chew one adult tablet. Stay with them until help arrives.",
        
        "bleeding": "Apply firm pressure with clean cloth or bandage. Elevate injured area above heart if possible. For severe bleeding, use pressure points and apply tourniquet only as last resort. Seek immediate medical attention.",
        
        "burn": "Run cool (not cold) water over burn for 10-15 minutes. Don't use ice. Cover with clean, dry bandage. Don't apply butter or ointments. Seek medical help for severe or large burns.",
        
        "choking": "For conscious adult: Stand behind person, wrap arms around waist. Make fist with one hand. Place fist thumb-side against middle of abdomen, just above navel. Grasp fist with other hand. Press into abdomen with quick, upward thrusts until object is expelled.",
        
        "fracture": "Immobilize injury area. Don't attempt to realign bone. Apply ice wrapped in cloth to reduce swelling. Seek immediate medical attention, especially for neck/spine injuries.",
        
        "heart attack": "Call emergency services. Have person sit/rest in comfortable position. If not allergic, give aspirin to chew. Loosen tight clothing. Monitor breathing/consciousness. Be prepared to perform CPR if needed.",
        
        "stroke": "Remember FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency services. Note time symptoms began. Don't give food/drink. Keep person comfortable until help arrives.",
        
        "seizure": "Clear area of objects. Guide person to floor if possible. Turn on side. Don't restrain or put anything in mouth. Time seizure duration. Call emergency services if lasting over 5 minutes or recurring.",
        
        "allergic reaction": "For severe reaction: Use epinephrine auto-injector if available and call emergency services. Remove trigger if possible. Help person sit/lie comfortably. Monitor breathing and consciousness."
      };
      
      // Find matching guidance
      const keyword = Object.keys(verifiedGuidance).find(key => 
        emergencyText.toLowerCase().includes(key)
      );
      
      let guidance = "I recommend calling emergency services immediately. While waiting: keep the person calm, monitor vital signs, and don't give food or drink unless specifically advised. If unconscious but breathing, place in recovery position. If not breathing, begin CPR if trained.";
      
      if (keyword) {
        guidance = verifiedGuidance[keyword];
      }
      
      // Incorporate medical record information when relevant
      if (personalizedGuidance) {
        // Add personalized alert for allergies or medications
        if (keyword === "allergic reaction" && currentMedicalRecord?.allergies) {
          guidance = `${personalizedGuidance}ALERT - Known allergies: ${currentMedicalRecord.allergies}. ${guidance}`;
        } 
        else if (keyword === "chest pain" && currentMedicalRecord?.medications) {
          guidance = `${personalizedGuidance}ALERT - Current medications: ${currentMedicalRecord.medications}. Inform emergency services. ${guidance}`;
        }
        else {
          guidance = `${personalizedGuidance}${guidance}`;
        }
        
        // Add emergency contact info if available
        if (currentMedicalRecord?.emergencyContact && currentMedicalRecord?.emergencyPhone) {
          guidance += ` Emergency contact: ${currentMedicalRecord.emergencyContact} at ${currentMedicalRecord.emergencyPhone}.`;
        }
      }
      
      return guidance;
    } catch (error) {
      console.error('Error getting guidance:', error);
      return "Sorry, I can't help right now. Call emergency services if you need urgent help!";
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    addEmergencyEntry,
    addMedicalRecord,
    editMedicalRecord,
    deleteMedicalRecord,
    requestGuidance
  };
}

export default useEmergencyData;
