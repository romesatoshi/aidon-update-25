
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
}

export function useEmergencyData() {
  const [data, setData] = useState<EmergencyData>({ history: [] });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Load mock data for demonstration
    setData({ history: mockUserHistory });
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

  const requestGuidance = async (emergencyText: string): Promise<string> => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call to your backend
      // For this demo, we'll simulate a response with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponses: Record<string, string> = {
        "chest pain": "Sit the person down in a comfortable position. Call emergency services immediately. If available, give aspirin (unless allergic). Stay with them and monitor their condition until help arrives.",
        "bleeding": "Apply direct pressure to the wound with a clean cloth or bandage. Elevate the injured area above the heart if possible. Call for emergency help if bleeding is severe or doesn't stop after 15 minutes of pressure.",
        "burn": "Cool the burn with cool (not cold) running water for 10-15 minutes. Don't use ice. Cover with a clean, dry cloth. Don't apply creams, ointments, or butter to burns. Seek medical attention for severe or large burns.",
        "choking": "Encourage the person to cough. If they can't speak or cough, stand behind them and give up to 5 back blows between the shoulder blades. If unsuccessful, give up to 5 abdominal thrusts. Continue alternating until the object is expelled or emergency help arrives.",
        "fracture": "Don't move the injured area. Immobilize the area with a splint if possible. Apply ice wrapped in a cloth to reduce swelling. Call for emergency help, especially for broken bones in the neck, back, hip, or thigh.",
        "heart attack": "Call emergency services immediately. Have the person sit down and rest. If available and not allergic, give them an aspirin to chew. Loosen tight clothing. Monitor their condition and be prepared to perform CPR if they become unresponsive and stop breathing normally.",
        "stroke": "Call emergency services immediately if you notice Face drooping, Arm weakness, or Speech difficulty - it's Time to call emergency services (FAST). Note the time symptoms began. Don't give them anything to eat or drink. Keep them comfortable until help arrives.",
        "seizure": "Clear the area of hard or sharp objects. Gently guide them to the floor. Place something soft under their head. Turn them onto their side. Don't put anything in their mouth. Time the seizure. If it lasts longer than 5 minutes or they have multiple seizures, call emergency services.",
        "allergic reaction": "If they have an epinephrine auto-injector, help them use it. Call emergency services. Help them sit or lie comfortably. If they become unresponsive, perform CPR if needed."
      };
      
      // Attempt to match the emergency to a predefined response
      const keyword = Object.keys(mockResponses).find(key => 
        emergencyText.toLowerCase().includes(key)
      );
      
      let guidance = "I recommend calling emergency services immediately for professional medical assistance. While waiting, keep the person calm and still, monitor their breathing and consciousness, and don't give them food or drink. Don't move them unless absolutely necessary. If unconscious but breathing, place them in the recovery position. If not breathing, begin CPR if trained.";
      
      if (keyword) {
        guidance = mockResponses[keyword];
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
    requestGuidance
  };
}

export default useEmergencyData;
