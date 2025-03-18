import { useState, useEffect } from 'react';
import { mockUserHistory } from '../lib/mockData';
import { MedicalRecord } from '@/components/medical-records/types';

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

  // Generate a unique emergency code
  const generateEmergencyCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

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
    // Ensure each record has a unique emergency code
    const recordWithCode = {
      ...record,
      emergencyCode: record.emergencyCode || generateEmergencyCode()
    };

    setData(prev => {
      const updatedRecords = [recordWithCode, ...(prev.medicalRecords || [])];
      
      // Save to localStorage
      localStorage.setItem('medicalRecords', JSON.stringify(updatedRecords));
      
      return {
        ...prev,
        medicalRecords: updatedRecords
      };
    });
  };
  
  const editMedicalRecord = (updatedRecord: MedicalRecord) => {
    // Ensure record has an emergency code
    const recordWithCode = {
      ...updatedRecord,
      emergencyCode: updatedRecord.emergencyCode || generateEmergencyCode()
    };

    setData(prev => {
      const existingRecords = prev.medicalRecords || [];
      const updatedRecords = existingRecords.map(record => 
        record.id === recordWithCode.id ? recordWithCode : record
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

  // Check if emergency text explicitly asks for personal information
  const requestsPersonalInfo = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return lowerText.includes("my info") || 
           lowerText.includes("my medical") || 
           lowerText.includes("my record") || 
           lowerText.includes("my details") ||
           lowerText.includes("my allergies") ||
           lowerText.includes("my medication") ||
           lowerText.includes("my condition") ||
           lowerText.includes("about me");
  };

  const requestGuidance = async (emergencyText: string): Promise<string> => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call to a medical AI service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Enhanced specific emergency response system with more keywords and synonyms
      const emergencyResponses: Record<string, string> = {
        // Trauma/Injuries
        "car accident": "1. Ensure scene safety. 2. Call emergency services. 3. Check for responsiveness. 4. If unresponsive but breathing, place in recovery position. 5. If not breathing, begin CPR. 6. Control bleeding with direct pressure. 7. Don't move victims with potential spine injuries. 8. Keep victims warm to prevent shock.",
        "vehicle crash": "1. Ensure scene safety. 2. Call emergency services. 3. Check for responsiveness. 4. If unresponsive but breathing, place in recovery position. 5. If not breathing, begin CPR. 6. Control bleeding with direct pressure. 7. Don't move victims with potential spine injuries. 8. Keep victims warm to prevent shock.",
        "collision": "1. Ensure scene safety. 2. Call emergency services. 3. Check for responsiveness. 4. If unresponsive but breathing, place in recovery position. 5. If not breathing, begin CPR. 6. Control bleeding with direct pressure. 7. Don't move victims with potential spine injuries. 8. Keep victims warm to prevent shock.",
        
        "fall": "1. Check for responsiveness. 2. Assess for bleeding, broken bones, or head injury. 3. Don't move person if back/neck injury suspected. 4. For minor falls, apply ice to bruised areas. 5. Monitor for signs of concussion (confusion, vomiting, unequal pupils). 6. Seek medical attention for any concerning symptoms.",
        "fell": "1. Check for responsiveness. 2. Assess for bleeding, broken bones, or head injury. 3. Don't move person if back/neck injury suspected. 4. For minor falls, apply ice to bruised areas. 5. Monitor for signs of concussion (confusion, vomiting, unequal pupils). 6. Seek medical attention for any concerning symptoms.",
        "fell down": "1. Check for responsiveness. 2. Assess for bleeding, broken bones, or head injury. 3. Don't move person if back/neck injury suspected. 4. For minor falls, apply ice to bruised areas. 5. Monitor for signs of concussion (confusion, vomiting, unequal pupils). 6. Seek medical attention for any concerning symptoms.",
        
        "head injury": "1. Call emergency services for serious injury. 2. Keep person still if you suspect spine injury. 3. Apply gentle pressure with clean cloth to control bleeding. 4. Don't remove objects embedded in wound. 5. Monitor for confusion, vomiting, seizures, or unequal pupils. 6. If unconscious but breathing, place in recovery position. 7. Apply cold pack wrapped in cloth to reduce swelling.",
        "head wound": "1. Call emergency services for serious injury. 2. Keep person still if you suspect spine injury. 3. Apply gentle pressure with clean cloth to control bleeding. 4. Don't remove objects embedded in wound. 5. Monitor for confusion, vomiting, seizures, or unequal pupils. 6. If unconscious but breathing, place in recovery position. 7. Apply cold pack wrapped in cloth to reduce swelling.",
        "hit head": "1. Call emergency services for serious injury. 2. Keep person still if you suspect spine injury. 3. Apply gentle pressure with clean cloth to control bleeding. 4. Don't remove objects embedded in wound. 5. Monitor for confusion, vomiting, seizures, or unequal pupils. 6. If unconscious but breathing, place in recovery position. 7. Apply cold pack wrapped in cloth to reduce swelling.",
        "concussion": "1. Call emergency services for serious injury. 2. Keep person still. 3. Monitor for confusion, vomiting, seizures, or unequal pupils. 4. If unconscious but breathing, place in recovery position. 5. Apply cold pack wrapped in cloth to reduce swelling. 6. Do not let the person sleep if the injury just occurred. 7. Seek immediate medical attention.",
        
        "cut": "1. Wash hands before treating. 2. Apply direct pressure with clean cloth for 15 minutes to stop bleeding. 3. Clean wound with soap and water. 4. Apply antibiotic ointment and sterile dressing. 5. Seek medical help for deep cuts, excessive bleeding, or embedded objects. 6. Elevate injured area if possible.",
        "laceration": "1. Wash hands before treating. 2. Apply direct pressure with clean cloth for 15 minutes to stop bleeding. 3. Clean wound with soap and water. 4. Apply antibiotic ointment and sterile dressing. 5. Seek medical help for deep cuts, excessive bleeding, or embedded objects. 6. Elevate injured area if possible.",
        "gash": "1. Wash hands before treating. 2. Apply direct pressure with clean cloth for 15 minutes to stop bleeding. 3. Clean wound with soap and water. 4. Apply antibiotic ointment and sterile dressing. 5. Seek medical help for deep cuts, excessive bleeding, or embedded objects. 6. Elevate injured area if possible.",
        
        "bleeding": "1. Apply firm pressure with clean cloth. 2. If possible, elevate bleeding area above heart. 3. Add more cloth layers if blood soaks through (don't remove first layer). 4. For severe bleeding, apply pressure to artery pressure points. 5. Use tourniquet only as last resort for life-threatening limb bleeding. 6. Keep victim warm and call emergency services.",
        "blood": "1. Apply firm pressure with clean cloth. 2. If possible, elevate bleeding area above heart. 3. Add more cloth layers if blood soaks through (don't remove first layer). 4. For severe bleeding, apply pressure to artery pressure points. 5. Use tourniquet only as last resort for life-threatening limb bleeding. 6. Keep victim warm and call emergency services.",
        "hemorrhage": "1. Apply firm pressure with clean cloth. 2. If possible, elevate bleeding area above heart. 3. Add more cloth layers if blood soaks through (don't remove first layer). 4. For severe bleeding, apply pressure to artery pressure points. 5. Use tourniquet only as last resort for life-threatening limb bleeding. 6. Keep victim warm and call emergency services.",
        
        "fracture": "1. Call emergency services if bone is protruding or deformity is severe. 2. Immobilize the injured area in the position found - don't try to realign. 3. Apply ice wrapped in cloth to reduce swelling. 4. For an open fracture, cover wound with sterile dressing before immobilizing. 5. Monitor for signs of shock. 6. Don't allow the person to eat or drink in case surgery is needed.",
        "broken bone": "1. Call emergency services if bone is protruding or deformity is severe. 2. Immobilize the injured area in the position found - don't try to realign. 3. Apply ice wrapped in cloth to reduce swelling. 4. For an open fracture, cover wound with sterile dressing before immobilizing. 5. Monitor for signs of shock. 6. Don't allow the person to eat or drink in case surgery is needed.",
        "broken arm": "1. Call emergency services if bone is protruding or deformity is severe. 2. Immobilize the arm in the position found - don't try to realign. 3. Apply ice wrapped in cloth to reduce swelling. 4. For an open fracture, cover wound with sterile dressing before immobilizing. 5. Create a sling to support the arm if possible. 6. Monitor for signs of shock.",
        "broken leg": "1. Call emergency services if bone is protruding or deformity is severe. 2. Immobilize the leg in the position found - don't try to realign. 3. Apply ice wrapped in cloth to reduce swelling. 4. For an open fracture, cover wound with sterile dressing before immobilizing. 5. Do not allow weight-bearing on the injured leg. 6. Monitor for signs of shock.",
        
        // Cardiac/Respiratory
        "heart attack": "1. Call emergency services immediately. 2. Have person sit in comfortable position, typically leaning forward. 3. Give aspirin (325mg) if not allergic. 4. Loosen tight clothing. 5. Be prepared to perform CPR if person becomes unresponsive and stops breathing normally. 6. If available, use AED following prompts.",
        "cardiac arrest": "1. Call emergency services immediately. 2. Begin CPR immediately - push hard and fast in center of chest at a rate of 100-120 compressions per minute. 3. If available, use AED following prompts. 4. Continue CPR until emergency services arrive or person shows signs of life. 5. If possible, have bystanders take turns performing CPR to prevent fatigue.",
        "myocardial infarction": "1. Call emergency services immediately. 2. Have person sit in comfortable position, typically leaning forward. 3. Give aspirin (325mg) if not allergic. 4. Loosen tight clothing. 5. Be prepared to perform CPR if person becomes unresponsive and stops breathing normally. 6. If available, use AED following prompts.",
        
        "chest pain": "1. Call emergency services. 2. Help person into comfortable position (usually sitting). 3. If available and not contraindicated, give aspirin to chew. 4. Check if person has prescribed nitroglycerin and help them take it. 5. Loosen tight clothing. 6. Monitor breathing and consciousness. 7. Be prepared to start CPR if person becomes unresponsive and stops breathing normally.",
        "pressure in chest": "1. Call emergency services. 2. Help person into comfortable position (usually sitting). 3. If available and not contraindicated, give aspirin to chew. 4. Check if person has prescribed nitroglycerin and help them take it. 5. Loosen tight clothing. 6. Monitor breathing and consciousness. 7. Be prepared to start CPR if person becomes unresponsive and stops breathing normally.",
        
        "stroke": "1. Call emergency services immediately. 2. Note when symptoms first appeared. 3. Use FAST test: Face drooping? Arm weakness? Speech difficulty? Time to call emergency services. 4. Don't give food or drink. 5. Place in recovery position if unconscious but breathing. 6. Check for breathing and pulse - begin CPR if necessary.",
        "face drooping": "1. Call emergency services immediately - this may be a stroke. 2. Note when symptoms first appeared. 3. Use FAST test: Face drooping? Arm weakness? Speech difficulty? Time to call emergency services. 4. Don't give food or drink. 5. Place in recovery position if unconscious but breathing. 6. Check for breathing and pulse - begin CPR if necessary.",
        "arm weakness": "1. Call emergency services immediately - this may be a stroke. 2. Note when symptoms first appeared. 3. Use FAST test: Face drooping? Arm weakness? Speech difficulty? Time to call emergency services. 4. Don't give food or drink. 5. Place in recovery position if unconscious but breathing. 6. Check for breathing and pulse - begin CPR if necessary.",
        "speech difficulty": "1. Call emergency services immediately - this may be a stroke. 2. Note when symptoms first appeared. 3. Use FAST test: Face drooping? Arm weakness? Speech difficulty? Time to call emergency services. 4. Don't give food or drink. 5. Place in recovery position if unconscious but breathing. 6. Check for breathing and pulse - begin CPR if necessary.",
        
        "choking": "1. Ask 'Are you choking?' If they nod yes and cannot speak or cough, act quickly. 2. Stand behind person with one foot forward between their feet. 3. Place fist thumb-side against middle of abdomen just above navel. 4. Grasp fist with other hand. 5. Perform quick upward thrusts until object expelled. 6. If person becomes unconscious, lower to ground and begin CPR.",
        "can't breathe": "1. Ask 'Are you choking?' If they nod yes and cannot speak or cough, act quickly. 2. Stand behind person with one foot forward between their feet. 3. Place fist thumb-side against middle of abdomen just above navel. 4. Grasp fist with other hand. 5. Perform quick upward thrusts until object expelled. 6. If person becomes unconscious, lower to ground and begin CPR.",
        "heimlich": "1. Ask 'Are you choking?' If they nod yes and cannot speak or cough, act quickly. 2. Stand behind person with one foot forward between their feet. 3. Place fist thumb-side against middle of abdomen just above navel. 4. Grasp fist with other hand. 5. Perform quick upward thrusts until object expelled. 6. If person becomes unconscious, lower to ground and begin CPR.",
        
        "difficulty breathing": "1. Help person sit upright to ease breathing. 2. Call emergency services. 3. Loosen tight clothing around neck/chest. 4. Check if person has rescue medications (like asthma inhaler) and assist if needed. 5. Encourage slow, deep breathing. 6. If breathing stops, begin CPR. 7. If allergic reaction suspected and epinephrine available, assist with administration.",
        "shortness of breath": "1. Help person sit upright to ease breathing. 2. Call emergency services. 3. Loosen tight clothing around neck/chest. 4. Check if person has rescue medications (like asthma inhaler) and assist if needed. 5. Encourage slow, deep breathing. 6. If breathing stops, begin CPR. 7. If allergic reaction suspected and epinephrine available, assist with administration.",
        "trouble breathing": "1. Help person sit upright to ease breathing. 2. Call emergency services. 3. Loosen tight clothing around neck/chest. 4. Check if person has rescue medications (like asthma inhaler) and assist if needed. 5. Encourage slow, deep breathing. 6. If breathing stops, begin CPR. 7. If allergic reaction suspected and epinephrine available, assist with administration.",
        "asthma attack": "1. Help person sit upright. 2. Assist with using their rescue inhaler (usually blue) if available. 3. Encourage slow, steady breathing. 4. Call emergency services if symptoms don't improve after inhaler use, person can't speak in full sentences, lips turn blue, or condition worsens. 5. Help maintain calm environment and loosen tight clothing.",
        
        // Medical Emergencies
        "seizure": "1. Ease person to floor and clear area of dangerous objects. 2. Turn person on side to prevent choking. 3. Remove eyeglasses and loosen tight clothing. 4. Time the seizure. 5. NEVER put anything in their mouth. 6. Call emergency services if seizure lasts longer than 5 minutes, person doesn't wake up, person has another seizure, person is injured, pregnant, or has never had a seizure before.",
        "convulsion": "1. Ease person to floor and clear area of dangerous objects. 2. Turn person on side to prevent choking. 3. Remove eyeglasses and loosen tight clothing. 4. Time the seizure. 5. NEVER put anything in their mouth. 6. Call emergency services if seizure lasts longer than 5 minutes, person doesn't wake up, person has another seizure, person is injured, pregnant, or has never had a seizure before.",
        "fit": "1. Ease person to floor and clear area of dangerous objects. 2. Turn person on side to prevent choking. 3. Remove eyeglasses and loosen tight clothing. 4. Time the seizure. 5. NEVER put anything in their mouth. 6. Call emergency services if seizure lasts longer than 5 minutes, person doesn't wake up, person has another seizure, person is injured, pregnant, or has never had a seizure before.",
        
        "diabetic": "1. If conscious and symptoms suggest low blood sugar, give sugar source (juice, glucose tablets, honey). 2. If unconscious, don't give anything by mouth. 3. Call emergency services. 4. Place in recovery position if unconscious but breathing. 5. If available, and you're trained, a glucagon injection can be given for severe hypoglycemia. 6. If unsure whether high or low sugar and person is conscious, giving sugar won't harm in short term.",
        "insulin shock": "1. If conscious, give sugar source immediately (juice, glucose tablets, honey). 2. If unconscious, don't give anything by mouth. 3. Call emergency services. 4. Place in recovery position if unconscious but breathing. 5. If available, and you're trained, a glucagon injection can be given for severe hypoglycemia.",
        "low blood sugar": "1. Give sugar source immediately (juice, glucose tablets, honey). 2. If unconscious, don't give anything by mouth and call emergency services. 3. After initial sugar, provide a more substantial snack containing protein and complex carbohydrates. 4. If symptoms don't improve within 15 minutes, give more sugar and call emergency services.",
        "high blood sugar": "1. Call emergency services if person is confused, experiencing rapid breathing, has fruity breath odor, or is becoming unconscious. 2. Help them check their blood sugar level if equipment is available. 3. Encourage them to drink water (if conscious) to prevent dehydration. 4. Help them administer insulin if prescribed and they're able to direct you.",
        
        "allergic reaction": "1. Call emergency services for severe reactions. 2. If person has epinephrine auto-injector (EpiPen), help them use it or administer it yourself if trained. 3. Help person sit up to aid breathing. 4. Loosen tight clothing. 5. If reaction is mild and limited to skin, antihistamines may help if available. 6. Monitor for severe symptoms: trouble breathing, swelling of lips/throat, dizziness. 7. Be prepared to perform CPR if needed.",
        "anaphylaxis": "1. Call emergency services immediately. 2. If person has epinephrine auto-injector (EpiPen), help them use it or administer it yourself if trained. 3. Help person sit up to aid breathing. 4. Loosen tight clothing. 5. Monitor for severe symptoms and be prepared to perform CPR if needed. 6. Even after epinephrine, person needs emergency care as symptoms may return.",
        "allergic": "1. Call emergency services for severe reactions. 2. If person has epinephrine auto-injector (EpiPen), help them use it or administer it yourself if trained. 3. Help person sit up to aid breathing. 4. Loosen tight clothing. 5. If reaction is mild and limited to skin, antihistamines may help if available. 6. Monitor for severe symptoms: trouble breathing, swelling of lips/throat, dizziness. 7. Be prepared to perform CPR if needed.",
        "epipen": "1. Remove the auto-injector from its case. 2. Hold with orange tip pointing downward. 3. Remove blue safety cap by pulling straight up. 4. Place orange tip against outer thigh, then push firmly until you hear a click. 5. Hold for 3 seconds. 6. Remove and massage injection site for 10 seconds. 7. Call emergency services immediately. 8. Monitor person - a second dose may be needed if symptoms return.",
        
        "poison": "1. Call Poison Control Center immediately (US: 1-800-222-1222). 2. Follow their instructions precisely. 3. Don't induce vomiting unless specifically instructed to do so. 4. If poison is on skin, remove contaminated clothing and rinse skin with running water for 15-20 minutes. 5. If poison is in eye, flush with lukewarm water for 20 minutes. 6. Bring poison container/substance to hospital if emergency care needed.",
        "ingested": "1. Call Poison Control Center immediately (US: 1-800-222-1222). 2. Follow their instructions precisely. 3. Don't induce vomiting unless specifically instructed to do so. 4. Try to identify what was ingested and when, and how much. 5. Save the container or packaging if available. 6. Monitor for symptoms and provide this information to emergency services.",
        "swallowed": "1. Call Poison Control Center immediately (US: 1-800-222-1222). 2. Follow their instructions precisely. 3. Don't induce vomiting unless specifically instructed to do so. 4. Try to identify what was swallowed and when, and how much. 5. Save the container or packaging if available. 6. Monitor for symptoms and provide this information to emergency services.",
        
        // Pediatric Emergencies
        "child choking": "1. For child over 1 year: Give 5 back blows between shoulder blades with heel of hand. 2. If unsuccessful, give 5 abdominal thrusts (Heimlich maneuver). 3. Alternate between 5 back blows and 5 abdominal thrusts until object is expelled. 4. If child becomes unconscious, begin CPR. 5. Call emergency services.",
        "kid choking": "1. For child over 1 year: Give 5 back blows between shoulder blades with heel of hand. 2. If unsuccessful, give 5 abdominal thrusts (Heimlich maneuver). 3. Alternate between 5 back blows and 5 abdominal thrusts until object is expelled. 4. If child becomes unconscious, begin CPR. 5. Call emergency services.",
        
        "infant choking": "1. Hold infant face down on your forearm, supporting head. 2. Give 5 back blows between shoulder blades. 3. Turn infant face up, give 5 chest thrusts (press down on center of chest). 4. Check mouth and remove object only if visible. 5. Repeat until object expelled or infant becomes unconscious. 6. If unconscious, begin infant CPR. 7. Call emergency services.",
        "baby choking": "1. Hold infant face down on your forearm, supporting head. 2. Give 5 back blows between shoulder blades. 3. Turn infant face up, give 5 chest thrusts (press down on center of chest). 4. Check mouth and remove object only if visible. 5. Repeat until object expelled or infant becomes unconscious. 6. If unconscious, begin infant CPR. 7. Call emergency services.",
        
        "fever child": "1. For high fever (over 102°F/39°C), use age-appropriate dose of acetaminophen or ibuprofen. 2. Keep child hydrated with cool fluids. 3. Dress in light clothing. 4. Sponge with lukewarm water (not cold). 5. Seek immediate medical care for: fever in infant under 3 months, fever over 104°F (40°C), fever with rash, stiff neck, severe headache, confusion, difficulty breathing, or persistent vomiting.",
        "fever baby": "1. For infants under 3 months with ANY fever, seek immediate medical attention. 2. For older infants, use age-appropriate dose of acetaminophen (NOT ibuprofen for infants under 6 months). 3. Keep baby hydrated with breast milk, formula, or clear liquids. 4. Dress in light clothing. 5. Use a lukewarm washcloth to sponge baby's forehead, armpits, and groin.",
        "child high temperature": "1. For high fever (over 102°F/39°C), use age-appropriate dose of acetaminophen or ibuprofen. 2. Keep child hydrated with cool fluids. 3. Dress in light clothing. 4. Sponge with lukewarm water (not cold). 5. Seek immediate medical care for: fever in infant under 3 months, fever over 104°F (40°C), fever with rash, stiff neck, severe headache, confusion, difficulty breathing, or persistent vomiting.",
        
        // Environmental Emergencies
        "heat exhaustion": "1. Move to cool place. 2. Remove excess clothing. 3. Place cool, wet cloths on body or take cool bath. 4. Sip water. 5. Seek immediate medical care if symptoms worsen or include: confusion, inability to drink, vomiting, or loss of consciousness.",
        "overheated": "1. Move to cool place. 2. Remove excess clothing. 3. Place cool, wet cloths on body or take cool bath. 4. Sip water. 5. Seek immediate medical care if symptoms worsen or include: confusion, inability to drink, vomiting, or loss of consciousness.",
        
        "heatstroke": "1. Call emergency services immediately - this is life-threatening. 2. Move person to cool place. 3. Remove excess clothing. 4. Cool with whatever means available: cool water, ice packs to armpits/groin/neck, fans. 5. Do NOT give fluids if unconscious. 6. Monitor breathing and be prepared to give CPR if needed.",
        "sunstroke": "1. Call emergency services immediately - this is life-threatening. 2. Move person to cool place. 3. Remove excess clothing. 4. Cool with whatever means available: cool water, ice packs to armpits/groin/neck, fans. 5. Do NOT give fluids if unconscious. 6. Monitor breathing and be prepared to give CPR if needed.",
        
        "hypothermia": "1. Call emergency services. 2. Move person to warm location. 3. Remove wet clothing. 4. Warm center of body first - chest, neck, head, groin. 5. Use blankets, skin-to-skin contact under dry blankets/clothing. 6. Give warm beverages if conscious (no alcohol). 7. Once body temperature increased, keep person dry and wrapped in warm blanket. 8. Monitor breathing and perform CPR if needed.",
        "too cold": "1. Call emergency services. 2. Move person to warm location. 3. Remove wet clothing. 4. Warm center of body first - chest, neck, head, groin. 5. Use blankets, skin-to-skin contact under dry blankets/clothing. 6. Give warm beverages if conscious (no alcohol). 7. Once body temperature increased, keep person dry and wrapped in warm blanket. 8. Monitor breathing and perform CPR if needed.",
        "frostbite": "1. Seek medical attention. 2. Do NOT rub or massage affected areas - this can cause more damage. 3. Do NOT use direct heat like heating pad or fire. 4. Immerse area in warm (NOT hot) water of 104-107°F (40-42°C) for 15-30 minutes. 5. For faces, ears, or nose, use warm wet cloths. 6. After warming, bandage area with dry, sterile dressing. 7. Keep affected body parts elevated.",
        
        "drowning": "1. Ensure your safety first. 2. Remove from water. 3. Call emergency services. 4. Begin CPR immediately if not breathing. 5. Place in recovery position if breathing. 6. Keep warm with dry blankets/clothing. 7. All drowning victims need medical evaluation, even if they seem fine.",
        "submerged": "1. Ensure your safety first. 2. Remove from water. 3. Call emergency services. 4. Begin CPR immediately if not breathing. 5. Place in recovery position if breathing. 6. Keep warm with dry blankets/clothing. 7. All drowning victims need medical evaluation, even if they seem fine.",
        "near drowning": "1. Ensure your safety first. 2. Remove from water. 3. Call emergency services. 4. Begin CPR immediately if not breathing. 5. Place in recovery position if breathing. 6. Keep warm with dry blankets/clothing. 7. All drowning victims need medical evaluation, even if they seem fine - secondary drowning can occur hours later.",
        
        // Mental Health Emergencies
        "suicidal": "1. Take all suicide threats or attempts seriously. 2. Stay with the person - don't leave them alone. 3. Remove access to lethal means (weapons, medications, etc). 4. Call emergency services or a suicide hotline (US: 988 Suicide & Crisis Lifeline). 5. Listen without judgment and offer reassurance. 6. Don't argue, threaten, or raise your voice. 7. Get professional help, even if the person resists.",
        "suicide": "1. Take all suicide threats or attempts seriously. 2. Stay with the person - don't leave them alone. 3. Remove access to lethal means (weapons, medications, etc). 4. Call emergency services or a suicide hotline (US: 988 Suicide & Crisis Lifeline). 5. Listen without judgment and offer reassurance. 6. Don't argue, threaten, or raise your voice. 7. Get professional help, even if the person resists.",
        "self harm": "1. Stay calm and remove potential harmful objects. 2. Take the person seriously and listen without judgment. 3. For immediate danger to life, call emergency services. 4. For less urgent situations, contact a mental health crisis line. 5. Don't promise to keep self-harm a secret - appropriate help is needed. 6. Encourage professional help from a mental health provider.",
        
        "panic attack": "1. Stay with the person and remain calm. 2. Use a calm, reassuring voice. 3. Encourage slow, deep breathing - breathe with them if helpful. 4. Remind them that panic attacks are temporary and not dangerous. 5. Ask them what they need - some prefer space, others prefer talking. 6. Encourage them to focus on a single object, texture, or sound. 7. If first attack or uncertain, seek medical attention to rule out other causes.",
        "anxiety attack": "1. Stay with the person and remain calm. 2. Use a calm, reassuring voice. 3. Encourage slow, deep breathing - breathe with them if helpful. 4. Remind them that anxiety attacks are temporary and not dangerous. 5. Ask them what they need - some prefer space, others prefer talking. 6. Encourage them to focus on a single object, texture, or sound. 7. If symptoms don't improve or worsen, seek medical help.",
        
        // Additional common emergencies
        "burn": "1. Remove from heat source and remove jewelry/tight items near burn. 2. Cool burn with cool (not cold) running water for 10-15 minutes. 3. Don't apply ice, butter, oil, or ointments. 4. Cover loosely with sterile, non-stick bandage. 5. Take over-the-counter pain reliever if needed. 6. Seek medical attention for: burns larger than 3 inches; burns on face, hands, feet, genitals; third-degree burns (white or charred appearance); or if victim is very young or elderly.",
        "scalded": "1. Remove from heat source immediately. 2. Cool burn with cool (not cold) running water for 10-15 minutes. 3. Don't apply ice, butter, oil, or ointments. 4. Cover loosely with sterile, non-stick bandage. 5. Take over-the-counter pain reliever if needed. 6. Seek medical attention for extensive or severe scalds.",
        "fire": "1. If someone's clothes are on fire, have them stop, drop, and roll. 2. Once fire is out, treat as a burn: cool with running water for 10-15 minutes. 3. Don't remove stuck clothing. 4. Cover loosely with sterile, non-stick bandage. 5. Call emergency services for significant burns. 6. Monitor for signs of shock.",
        
        "broken tooth": "1. Rinse mouth with warm water. 2. Apply cold compress to face to reduce swelling. 3. Save any broken tooth pieces. 4. Take over-the-counter pain medication if needed. 5. See dentist as soon as possible - within 24 hours for breaks and immediately for severe pain or tooth knocked out completely.",
        "tooth knocked out": "1. Find the tooth and pick it up by the crown (white part), not the root. 2. Gently rinse with water if dirty, but don't scrub or remove attached tissue. 3. Try to reinsert in socket, if possible. 4. If not, place tooth in milk, saline solution, or saliva (under tongue). 5. See dentist immediately - within 30 minutes if possible for best chance of saving tooth.",
        "dental emergency": "1. For toothache: Rinse with warm water and gently floss to remove trapped food. 2. For broken tooth: Save pieces, rinse mouth with warm water, apply cold compress for swelling. 3. For knocked-out tooth: Handle by crown, rinse gently if dirty, try to place back in socket or store in milk. 4. For object caught between teeth: Try to remove gently with floss. 5. See dentist as soon as possible.",
        
        "eye injury": "1. Do NOT rub or touch the eye. 2. Do NOT remove embedded objects. 3. If chemical splash, rinse with clean water for 15-20 minutes. 4. For cuts/punctures, shield eye with paper cup or similar object without pressure. 5. For bruising, apply cold compress without pressure. 6. Seek immediate medical attention for all serious eye injuries.",
        "something in eye": "1. Do NOT rub the eye. 2. Blink several times to see if tears will flush out the particle. 3. Pull upper eyelid over lower eyelid and release - this can help remove particle. 4. Flush gently with clean water or saline solution. 5. If particle remains, cover eye and seek medical attention. 6. For chemicals in eye, flush continuously with water for 15-20 minutes and seek immediate medical attention.",
        
        "sprain": "1. Remember RICE: Rest the injured area, Ice for 20 minutes every 2-3 hours, Compress with elastic bandage, and Elevate above heart level when possible. 2. Take over-the-counter pain relievers if needed. 3. Avoid heat for first 48 hours. 4. Seek medical attention if you can't bear weight, have severe pain, or significant swelling/bruising.",
        "strain": "1. Remember RICE: Rest the injured area, Ice for 20 minutes every 2-3 hours, Compress with elastic bandage, and Elevate when possible. 2. Take over-the-counter pain relievers if needed. 3. Avoid heat for first 48 hours. 4. Gradually return to normal activities. 5. Seek medical attention if pain or swelling is severe or doesn't improve after several days.",
        "twisted ankle": "1. Remember RICE: Rest the ankle, Ice for 20 minutes every 2-3 hours, Compress with elastic bandage, and Elevate the foot above heart level when possible. 2. Take over-the-counter pain relievers if needed. 3. Avoid putting weight on the injured foot. 4. If you can't bear weight, have severe pain, or see significant swelling or bruising, seek medical attention to rule out a fracture.",
        
        "unconscious": "1. Call emergency services immediately. 2. Check breathing and pulse. 3. If breathing, place in recovery position (on side). 4. If not breathing, begin CPR if trained. 5. Keep airway open. 6. Check for injuries or medical alert jewelry. 7. Don't give anything by mouth. 8. Keep person warm with blanket.",
        "passed out": "1. Check if the person is breathing and has a pulse. 2. Call emergency services. 3. If breathing, place in recovery position (on side). 4. Loosen tight clothing. 5. Don't give anything to eat or drink. 6. Check for injuries from falling. 7. If caused by heat, move to cooler location. 8. If the person vomits, turn head to side to prevent choking.",
        "fainted": "1. Lay the person flat on their back and raise their feet about 12 inches. 2. Loosen tight clothing. 3. Check breathing and pulse - begin CPR if necessary. 4. If the person is breathing normally but still unconscious, place in recovery position (on side). 5. When they regain consciousness, give juice or water. 6. Seek medical attention if: first time fainting, injured during fall, pregnant, over 50, chest pain, shortness of breath, irregular heartbeat, or continued weakness.",
        
        "nosebleed": "1. Sit upright and lean slightly forward to prevent blood from running down throat. 2. Pinch the soft part of the nose just below the bony bridge firmly for 10-15 minutes continuously. 3. Breathe through mouth. 4. Apply cold compress to bridge of nose. 5. Seek medical attention if bleeding doesn't stop after 20 minutes, is extremely heavy, or follows head injury."
      };
      
      // Multiple pass pattern matching for better emergency detection
      let foundMatch = false;
      let guidance = "";
      const lowerEmergencyText = emergencyText.toLowerCase();
      
      // First try to find exact phrase matches
      for (const [key, value] of Object.entries(emergencyResponses)) {
        if (lowerEmergencyText.includes(key)) {
          guidance = value;
          foundMatch = true;
          break;
        }
      }
      
      // If no exact match, try to find keyword matches (more flexible)
      if (!foundMatch) {
        const emergencyWords = lowerEmergencyText.split(/\s+/);
        const keywordMap = new Map();
        
        // Count occurrences of keywords in the emergencyResponses
        for (const keyword of Object.keys(emergencyResponses)) {
          for (const word of emergencyWords) {
            if (keyword.includes(word) && word.length > 3) { // Only meaningful words
              keywordMap.set(keyword, (keywordMap.get(keyword) || 0) + 1);
            }
          }
        }
        
        // Find the keyword with the most matches
        let bestKeyword = "";
        let highestCount = 0;
        
        for (const [keyword, count] of keywordMap.entries()) {
          if (count > highestCount) {
            highestCount = count;
            bestKeyword = keyword;
          }
        }
        
        if (bestKeyword && highestCount > 0) {
          guidance = emergencyResponses[bestKeyword];
          foundMatch = true;
        }
      }
      
      // If still no match, use general emergency advice
      if (!foundMatch) {
        guidance = "For this emergency: 1. Call emergency services immediately. 2. Check consciousness and breathing. 3. If unconscious but breathing, place in recovery position (on side). 4. If not breathing, begin CPR if trained. 5. Control any bleeding with direct pressure. 6. Don't move victim if spinal injury possible. 7. Keep victim warm. 8. Monitor vital signs until help arrives.";
      }
      
      // Only add personalized info if explicitly requested
      let personalizedGuidance = "";
      if (requestsPersonalInfo(emergencyText)) {
        const currentMedicalRecord = data.medicalRecords?.[0];
        
        // Add personalized info based on medical record if available and explicitly requested
        if (currentMedicalRecord) {
          const relevantConditions = [];
          
          // Include age and sex information in personalization if available
          let demographicInfo = "";
          if (currentMedicalRecord.age) {
            demographicInfo += `${currentMedicalRecord.age} years old`;
          }
          if (currentMedicalRecord.sex) {
            demographicInfo += demographicInfo ? `, ${currentMedicalRecord.sex.toLowerCase()}` : currentMedicalRecord.sex;
          }
          if (demographicInfo) {
            personalizedGuidance += `Patient is ${demographicInfo}. `;
          }
          
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
            personalizedGuidance += `IMPORTANT - Medical record notes ${relevantConditions.join(", ")}. `;
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
            personalizedGuidance += `Emergency contact: ${currentMedicalRecord.emergencyContact} at ${currentMedicalRecord.emergencyPhone}. `;
          }
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
