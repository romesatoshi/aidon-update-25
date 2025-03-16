import { useState, useEffect } from 'react';
import { mockUserHistory } from '../lib/mockData';

export interface EmergencyEntry {
  id: string;
  timestamp: string;
  emergency: string;
  guidance: string;
  additionalInfo?: Record<string, string>;
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

  const addEmergencyEntry = (
    emergency: string, 
    guidance: string, 
    additionalInfo?: Record<string, string>
  ) => {
    const newEntry: EmergencyEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      emergency,
      guidance,
      additionalInfo
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Enhanced specific emergency response system
      const emergencyResponses: Record<string, string> = {
        // Trauma/Injuries
        "car accident": "1. Ensure scene safety. 2. Call emergency services. 3. Check for responsiveness. 4. If unresponsive but breathing, place in recovery position. 5. If not breathing, begin CPR. 6. Control bleeding with direct pressure. 7. Don't move victims with potential spine injuries. 8. Keep victims warm to prevent shock.",
        
        "fall": "1. Check for responsiveness. 2. Assess for bleeding, broken bones, or head injury. 3. Don't move person if back/neck injury suspected. 4. For minor falls, apply ice to bruised areas. 5. Monitor for signs of concussion (confusion, vomiting, unequal pupils). 6. Seek medical attention for any concerning symptoms.",
        
        "head injury": "1. Call emergency services for serious injury. 2. Keep person still if you suspect spine injury. 3. Apply gentle pressure with clean cloth to control bleeding. 4. Don't remove objects embedded in wound. 5. Monitor for confusion, vomiting, seizures, or unequal pupils. 6. If unconscious but breathing, place in recovery position. 7. Apply cold pack wrapped in cloth to reduce swelling.",
        
        "cut": "1. Wash hands before treating. 2. Apply direct pressure with clean cloth for 15 minutes to stop bleeding. 3. Clean wound with soap and water. 4. Apply antibiotic ointment and sterile dressing. 5. Seek medical help for deep cuts, excessive bleeding, or embedded objects. 6. Elevate injured area if possible.",
        
        "bleeding": "1. Apply firm pressure with clean cloth. 2. If possible, elevate bleeding area above heart. 3. Add more cloth layers if blood soaks through (don't remove first layer). 4. For severe bleeding, apply pressure to artery pressure points. 5. Use tourniquet only as last resort for life-threatening limb bleeding. 6. Keep victim warm and call emergency services.",
        
        // Cardiac/Respiratory
        "heart attack": "1. Call emergency services immediately. 2. Have person sit in comfortable position, typically leaning forward. 3. Give aspirin (325mg) if not allergic. 4. Loosen tight clothing. 5. Be prepared to perform CPR if person becomes unresponsive and stops breathing normally. 6. If available, use AED following prompts.",
        
        "chest pain": "1. Call emergency services. 2. Help person into comfortable position (usually sitting). 3. If available and not contraindicated, give aspirin to chew. 4. Check if person has prescribed nitroglycerin and help them take it. 5. Loosen tight clothing. 6. Monitor breathing and consciousness. 7. Be prepared to start CPR if person becomes unresponsive and stops breathing normally.",
        
        "stroke": "1. Call emergency services immediately. 2. Note when symptoms first appeared. 3. Use FAST test: Face drooping? Arm weakness? Speech difficulty? Time to call emergency services. 4. Don't give food or drink. 5. Place in recovery position if unconscious but breathing. 6. Check for breathing and pulse - begin CPR if necessary.",
        
        "choking": "1. Ask 'Are you choking?' If they nod yes and cannot speak or cough, act quickly. 2. Stand behind person with one foot forward between their feet. 3. Place fist thumb-side against middle of abdomen just above navel. 4. Grasp fist with other hand. 5. Perform quick upward thrusts until object expelled. 6. If person becomes unconscious, lower to ground and begin CPR.",
        
        "difficulty breathing": "1. Help person sit upright to ease breathing. 2. Call emergency services. 3. Loosen tight clothing around neck/chest. 4. Check if person has rescue medications (like asthma inhaler) and assist if needed. 5. Encourage slow, deep breathing. 6. If breathing stops, begin CPR. 7. If allergic reaction suspected and epinephrine available, assist with administration.",
        
        // Medical Emergencies
        "seizure": "1. Ease person to floor and clear area of dangerous objects. 2. Turn person on side to prevent choking. 3. Remove eyeglasses and loosen tight clothing. 4. Time the seizure. 5. NEVER put anything in their mouth. 6. Call emergency services if seizure lasts longer than 5 minutes, person doesn't wake up, person has another seizure, person is injured, pregnant, or has never had a seizure before.",
        
        "diabetic": "1. If conscious and symptoms suggest low blood sugar, give sugar source (juice, glucose tablets, honey). 2. If unconscious, don't give anything by mouth. 3. Call emergency services. 4. Place in recovery position if unconscious but breathing. 5. If available, and you're trained, a glucagon injection can be given for severe hypoglycemia. 6. If unsure whether high or low sugar and person is conscious, giving sugar won't harm in short term.",
        
        "allergic reaction": "1. Call emergency services for severe reactions. 2. If person has epinephrine auto-injector (EpiPen), help them use it or administer it yourself if trained. 3. Help person sit up to aid breathing. 4. Loosen tight clothing. 5. If reaction is mild and limited to skin, antihistamines may help if available. 6. Monitor for severe symptoms: trouble breathing, swelling of lips/throat, dizziness. 7. Be prepared to perform CPR if needed.",
        
        "poison": "1. Call Poison Control Center immediately (US: 1-800-222-1222). 2. Follow their instructions precisely. 3. Don't induce vomiting unless specifically instructed to do so. 4. If poison is on skin, remove contaminated clothing and rinse skin with running water for 15-20 minutes. 5. If poison is in eye, flush with lukewarm water for 20 minutes. 6. Bring poison container/substance to hospital if emergency care needed.",
        
        // Pediatric Emergencies
        "child choking": "1. For child over 1 year: Give 5 back blows between shoulder blades with heel of hand. 2. If unsuccessful, give 5 abdominal thrusts (Heimlich maneuver). 3. Alternate between 5 back blows and 5 abdominal thrusts until object is expelled. 4. If child becomes unconscious, begin CPR. 5. Call emergency services.",
        
        "infant choking": "1. Hold infant face down on your forearm, supporting head. 2. Give 5 back blows between shoulder blades. 3. Turn infant face up, give 5 chest thrusts (press down on center of chest). 4. Check mouth and remove object only if visible. 5. Repeat until object expelled or infant becomes unconscious. 6. If unconscious, begin infant CPR. 7. Call emergency services.",
        
        "fever child": "1. For high fever (over 102°F/39°C), use age-appropriate dose of acetaminophen or ibuprofen. 2. Keep child hydrated with cool fluids. 3. Dress in light clothing. 4. Sponge with lukewarm water (not cold). 5. Seek immediate medical care for: fever in infant under 3 months, fever over 104°F (40°C), fever with rash, stiff neck, severe headache, confusion, difficulty breathing, or persistent vomiting.",
        
        // Environmental Emergencies
        "heat exhaustion": "1. Move to cool place. 2. Remove excess clothing. 3. Place cool, wet cloths on body or take cool bath. 4. Sip water. 5. Seek immediate medical care if symptoms worsen or include: confusion, inability to drink, vomiting, or loss of consciousness.",
        
        "heatstroke": "1. Call emergency services immediately - this is life-threatening. 2. Move person to cool place. 3. Remove excess clothing. 4. Cool with whatever means available: cool water, ice packs to armpits/groin/neck, fans. 5. Do NOT give fluids if unconscious. 6. Monitor breathing and be prepared to give CPR if needed.",
        
        "hypothermia": "1. Call emergency services. 2. Move person to warm location. 3. Remove wet clothing. 4. Warm center of body first - chest, neck, head, groin. 5. Use blankets, skin-to-skin contact under dry blankets/clothing. 6. Give warm beverages if conscious (no alcohol). 7. Once body temperature increased, keep person dry and wrapped in warm blanket. 8. Monitor breathing and perform CPR if needed.",
        
        "drowning": "1. Ensure your safety first. 2. Remove from water. 3. Call emergency services. 4. Begin CPR immediately if not breathing. 5. Place in recovery position if breathing. 6. Keep warm with dry blankets/clothing. 7. All drowning victims need medical evaluation, even if they seem fine."
      };
      
      // Create customized guidance incorporating medical details if available
      let personalizedGuidance = "";
      const currentMedicalRecord = data.medicalRecords?.[0];
      
      // Find matching guidance from specific responses
      let foundSpecificGuidance = false;
      let guidance = "";
      
      for (const [key, value] of Object.entries(emergencyResponses)) {
        if (emergencyText.toLowerCase().includes(key)) {
          guidance = value;
          foundSpecificGuidance = true;
          break;
        }
      }
      
      // If no specific match found, use general emergency advice
      if (!foundSpecificGuidance) {
        guidance = "For this emergency: 1. Call emergency services immediately. 2. Check consciousness and breathing. 3. If unconscious but breathing, place in recovery position (on side). 4. If not breathing, begin CPR if trained. 5. Control any bleeding with direct pressure. 6. Don't move victim if spinal injury possible. 7. Keep victim warm. 8. Monitor vital signs until help arrives.";
      }
      
      // Add personalized info based on medical record if available
      if (currentMedicalRecord) {
        const relevantConditions = [];
        
        // Check if the emergency might be related to existing conditions
        if (currentMedicalRecord.conditions && 
            (emergencyText.toLowerCase().includes("chest pain") || 
             emergencyText.toLowerCase().includes("heart"))) {
          relevantConditions.push("heart condition");
        }
        
        if (currentMedicalRecord.allergies && 
            (emergencyText.toLowerCase().includes("rash") || 
             emergencyText.toLowerCase().includes("swelling") || 
             emergencyText.toLowerCase().includes("breathing") ||
             emergencyText.toLowerCase().includes("allergic"))) {
          relevantConditions.push("allergies");
        }
        
        if (relevantConditions.length > 0) {
          personalizedGuidance = `IMPORTANT - Medical record notes ${relevantConditions.join(", ")}. `;
        }
        
        // Add medication and allergy info if relevant to the emergency
        if (emergencyText.toLowerCase().includes("allergic") && currentMedicalRecord.allergies) {
          personalizedGuidance += `Known allergies: ${currentMedicalRecord.allergies}. `;
        } 
        
        if ((emergencyText.toLowerCase().includes("chest") || emergencyText.toLowerCase().includes("heart")) && currentMedicalRecord.medications) {
          personalizedGuidance += `Current medications: ${currentMedicalRecord.medications}. Inform emergency services. `;
        }
        
        // Add emergency contact
        if (currentMedicalRecord.emergencyContact && currentMedicalRecord.emergencyPhone) {
          guidance += ` Emergency contact: ${currentMedicalRecord.emergencyContact} at ${currentMedicalRecord.emergencyPhone}.`;
        }
      }
      
      return personalizedGuidance + guidance;
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
