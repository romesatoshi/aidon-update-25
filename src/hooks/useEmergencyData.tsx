
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
    // Load mock data for demonstration and limit to 3 most recent entries
    const limitedHistory = mockUserHistory.slice(0, 3);
    setData(prev => ({ 
      ...prev, 
      history: limitedHistory
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
    
    setData(prev => {
      // Add new entry to the beginning and limit to 3 entries
      const updatedHistory = [newEntry, ...prev.history].slice(0, 3);
      
      return {
        ...prev,
        history: updatedHistory
      };
    });
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

  // Format guidance into step-by-step instructions following Red Cross protocols
  const formatGuidanceAsSteps = (rawGuidance: string): string => {
    if (!rawGuidance.includes('1.')) {
      // If guidance is not already in numbered steps format, try to format it
      const sentences = rawGuidance.split('. ').filter(s => s.trim().length > 0);
      if (sentences.length > 1) {
        return sentences.map((sentence, index) => 
          `${index + 1}. ${sentence}${!sentence.endsWith('.') ? '.' : ''}`
        ).join('\n');
      }
    }
    return rawGuidance; // Return as is if already formatted or can't be formatted
  };

  // Process a follow-up answer to provide additional guidance
  const processFollowUpAnswer = (question: string, answer: string): string => {
    const lowerAnswer = answer.toLowerCase();
    
    // Common follow-up guidance based on Red Cross protocols
    if (question.includes("breathing") && (lowerAnswer.includes("no") || lowerAnswer.includes("not"))) {
      return "CRITICAL: Begin CPR immediately. Call emergency services if not already done. Place hands on center of chest and push hard and fast at rate of 100-120 compressions per minute. If trained, give 2 rescue breaths after 30 compressions.";
    }
    
    if (question.includes("bleeding") && (lowerAnswer.includes("heavy") || lowerAnswer.includes("lot") || lowerAnswer.includes("pulsating"))) {
      return "CRITICAL: Apply firm direct pressure with clean cloth or bandage. If blood soaks through, add more layers without removing original dressing. Elevate the wounded area above heart level if possible. Apply pressure to pressure points (arm: inside of upper arm; leg: crease of hip). For life-threatening bleeding on limbs, consider tourniquet as last resort.";
    }
    
    if (question.includes("conscious") && (lowerAnswer.includes("no") || lowerAnswer.includes("not") || lowerAnswer.includes("unconscious"))) {
      return "CRITICAL: Check breathing. If breathing, place in recovery position (on side with top leg and arm bent for support, head tilted back slightly). If not breathing normally, begin CPR immediately. Call emergency services if not already done.";
    }
    
    if (question.includes("allergic") && (lowerAnswer.includes("yes") || lowerAnswer.includes("severe") || lowerAnswer.includes("swelling"))) {
      return "CRITICAL: If person has epinephrine auto-injector (EpiPen), help them use it immediately. Call emergency services. Help them sit up to aid breathing. Loosen tight clothing. Even after using epinephrine, symptoms may return, so emergency care is still necessary.";
    }
    
    return "Thank you for providing this information. It will help emergency responders when they arrive. Continue monitoring the situation and be ready to adjust care as needed.";
  };

  const requestGuidance = async (emergencyText: string): Promise<string> => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call to a medical AI service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Enhanced emergency response system with Red Cross protocol integration
      const redCrossProtocols: Record<string, string> = {
        // Trauma/Injuries
        "car accident": "1. Ensure scene safety first - check for hazards like traffic, fire, or unstable vehicles.\n2. Call emergency services (911) immediately.\n3. Check for responsiveness by tapping and shouting.\n4. If unresponsive but breathing, place in recovery position: roll onto side, top knee bent for support.\n5. For non-breathing victims, begin CPR: 30 chest compressions followed by 2 rescue breaths.\n6. Control severe bleeding with direct pressure using clean cloth.\n7. Do not move victims with suspected spinal injuries unless in immediate danger.\n8. Keep victims warm with blankets to prevent shock.\n9. Monitor vital signs (breathing, pulse, consciousness) until help arrives.\n10. Document injury mechanisms and times for emergency responders.",
        
        "fall": "1. Assess scene safety before approaching the fallen person.\n2. Check responsiveness by speaking loudly and gently tapping shoulders.\n3. If responsive, help the person remain still while assessing injuries.\n4. Look for visible injuries, focusing on head, neck, back, and limbs.\n5. Do not move person if back/neck injury is suspected unless in immediate danger.\n6. For minor falls, apply cold compresses to bruised areas for 20 minutes.\n7. Monitor for signs of concussion: confusion, vomiting, unequal pupils, severe headache.\n8. If elderly, even a minor fall may cause significant injury - seek medical evaluation.\n9. For falls from height greater than person's height, assume serious injury and call emergency services.\n10. Document time of fall and any loss of consciousness.",
        
        "head injury": "1. Call emergency services immediately for serious injury.\n2. Keep the person still, especially if neck/spine injury is suspected.\n3. If conscious, help them maintain a comfortable position with head/shoulders slightly elevated.\n4. Apply gentle pressure with clean cloth to control external bleeding - do not apply pressure to skull fractures.\n5. Never remove objects embedded in the wound.\n6. Monitor closely for: confusion, unusual drowsiness, vomiting, seizures, unequal pupils.\n7. If unconscious but breathing, place in recovery position (on side) while supporting head/neck alignment.\n8. Apply cold pack wrapped in cloth to reduce swelling (20 minutes on, 20 minutes off).\n9. Document time of injury and changes in symptoms.\n10. Even for minor head injuries, follow up with medical evaluation within 24 hours.",
        
        "cut": "1. Wash hands thoroughly before treating the wound.\n2. For bleeding wounds, apply direct pressure with clean cloth for 15 minutes.\n3. Once bleeding slows, clean wound thoroughly with mild soap and running water.\n4. Remove any debris visible in the wound using tweezers cleaned with alcohol.\n5. Apply antibiotic ointment to prevent infection.\n6. Cover with sterile dressing or bandage, ensuring it's not too tight.\n7. Elevate the injured area above heart level when possible to reduce swelling.\n8. Change dressing daily or when soiled.\n9. Seek medical help for: deep cuts, jagged wounds, wounds that won't stop bleeding after 15 minutes of pressure, or any cuts on face or joints.\n10. Watch for signs of infection: increasing pain, redness, swelling, warmth, pus, or red streaking from wound.",
        
        "bleeding": "1. Apply firm, direct pressure to the wound using clean cloth, gauze, or bandage.\n2. If possible, elevate the bleeding area above the level of the heart.\n3. Add more cloth layers if blood soaks through - do not remove the original dressing.\n4. For severe bleeding on limbs, apply pressure to major artery (brachial in arm, femoral in leg).\n5. As absolute last resort for life-threatening limb bleeding, apply tourniquet 2-3 inches above wound (not on joint).\n6. Mark time of tourniquet application clearly.\n7. Keep the victim lying down to prevent shock.\n8. Keep victim warm with blankets or clothing.\n9. Do not give food or drink, as surgery may be needed.\n10. Call emergency services immediately for serious bleeding.",
        
        "fracture": "1. Call emergency services if bone is protruding, area is deformed, or injury is severe.\n2. Keep the person still and prevent any movement of the injured area.\n3. Do not attempt to push protruding bones back or realign fractures.\n4. For open fractures (bone visible), cover wound with clean sterile dressing before immobilizing.\n5. Immobilize the fracture in the position found using splint materials (magazines, boards, pillows).\n6. Extend splint beyond joints above and below the fracture.\n7. Apply ice wrapped in cloth to reduce swelling (20 minutes on, 20 minutes off).\n8. Check circulation beyond injury (pulse, skin color, temperature) after splinting.\n9. Monitor for signs of shock (pale skin, rapid breathing, confusion).\n10. Do not allow eating or drinking in case surgery is needed.",
        
        // Cardiac/Respiratory
        "heart attack": "1. Call emergency services (911) immediately - do not drive the person yourself.\n2. Help person into comfortable position, typically sitting upright with knees bent.\n3. Administer aspirin (325mg) if the person is not allergic and can swallow.\n4. If prescribed, help the person take their nitroglycerin as directed.\n5. Loosen tight clothing, especially around neck and chest.\n6. Monitor and record vital signs (breathing, pulse, consciousness).\n7. Begin CPR immediately if the person becomes unresponsive and stops breathing normally.\n8. If available, retrieve an AED and use according to instructions.\n9. Reassure the person and keep them calm while waiting for emergency services.\n10. Document time symptoms began and any medications administered for emergency responders.",
        
        "chest pain": "1. Call emergency services (911) immediately - chest pain should always be treated as an emergency.\n2. Help the person into a comfortable semi-sitting position with knees bent to reduce strain on heart.\n3. If the person has been prescribed nitroglycerin, assist them in taking it as prescribed.\n4. If available and not contraindicated (no allergy, already taking blood thinners), give aspirin (325mg) to chew.\n5. Loosen tight clothing around neck, chest, and waist.\n6. Monitor breathing, pulse, and consciousness level while waiting for help.\n7. If person becomes unconscious, check breathing and circulation - be prepared to start CPR.\n8. Do not give food or drink in case medical procedures are needed.\n9. Keep the person calm and reassured to reduce anxiety.\n10. Gather information about duration of pain, associated symptoms, and medical history for emergency responders.",
        
        "stroke": "1. Call emergency services (911) immediately - time is critical for stroke treatment.\n2. Note the exact time when symptoms first appeared - this impacts treatment options.\n3. Use the FAST method to check for stroke signs: Face drooping, Arm weakness, Speech difficulty, Time to call 911.\n4. Keep the person lying down with head slightly elevated (pillows under head/shoulders).\n5. Do not give anything to eat or drink - swallowing may be compromised.\n6. If the person is unconscious but breathing, place in recovery position (on side).\n7. Remove dentures, glasses, or restrictive clothing.\n8. Check breathing and pulse regularly - begin CPR if necessary.\n9. Document symptoms and timing for emergency responders.\n10. Reassure the person and keep them calm while waiting for help.",
        
        "choking": "1. Ask clearly, 'Are you choking? Can you speak?' If they cannot speak or cough, act immediately.\n2. For conscious adult/child: Stand behind person with one foot between their feet for stability.\n3. Place fist thumb-side against middle of abdomen just above navel (below breastbone).\n4. Grasp fist with other hand and pull inward and upward with quick thrusts.\n5. Continue abdominal thrusts until object is expelled or person becomes unconscious.\n6. For unconscious person: Lower carefully to ground and begin CPR, checking mouth for visible object before breaths.\n7. For pregnant women or obese individuals: Place hands at center of chest instead of abdomen.\n8. For infants: Support face down along forearm with head lower than body, give 5 back blows between shoulder blades, then flip and give 5 chest thrusts.\n9. Continue alternating 5 back blows and 5 chest/abdominal thrusts until object is expelled.\n10. Seek medical attention after choking episode, even if resolved.",
        
        "difficulty breathing": "1. Call emergency services (911) immediately for severe breathing difficulty.\n2. Help the person into a comfortable position, usually sitting upright leaning slightly forward.\n3. Loosen tight clothing around neck, chest, and waist to ease breathing.\n4. For asthma: Help person use their rescue inhaler as prescribed (typically 2 puffs).\n5. Check if person has other rescue medications for specific conditions and assist if needed.\n6. Encourage slow, deep breathing through pursed lips if person is anxious.\n7. If available, provide supplemental oxygen only if trained to do so.\n8. For allergic reaction with breathing difficulty, administer epinephrine auto-injector if available and prescribed.\n9. Monitor for signs of cyanosis (bluish discoloration of lips, nail beds) which indicates severe oxygen deprivation.\n10. If breathing stops, begin CPR immediately.",
        
        // Medical Emergencies
        "seizure": "1. Note the time the seizure begins - duration is important medical information.\n2. Clear the area of furniture or objects that could cause injury.\n3. Gently guide the person to the floor if possible or prevent from falling.\n4. Place something soft and flat under their head for protection.\n5. Turn the person onto their side (recovery position) to prevent choking on saliva or vomit.\n6. NEVER place anything in the person's mouth - it's a dangerous myth.\n7. Do not restrain the person - restraint can cause injury.\n8. Call emergency services if: seizure lasts longer than 5 minutes, person doesn't regain consciousness, another seizure follows, person is injured, pregnant, or has never had a seizure before.\n9. After seizure ends, keep person on their side until fully conscious.\n10. Stay with the person until they are fully recovered, and help orient them as they regain consciousness.",
        
        "diabetic": "1. Determine if symptoms indicate low blood sugar (hypoglycemia) or high blood sugar (hyperglycemia).\n2. For low blood sugar (confusion, shakiness, irritability, sweating): If person is conscious and can swallow, give 15-20g of fast-acting sugar (juice, honey, glucose tablets).\n3. Wait 15 minutes, then recheck symptoms. Repeat sugar if symptoms persist.\n4. After symptoms improve, provide a more substantial snack with protein and complex carbohydrates.\n5. For unconscious person: Do not give anything by mouth, place in recovery position, call emergency services immediately.\n6. For high blood sugar (frequent urination, excessive thirst, dry mouth, fruity breath): Help person check blood sugar if equipment available.\n7. Encourage water consumption to prevent dehydration (if conscious).\n8. If person has prescribed insulin and is capable of directing you, assist with administration as instructed.\n9. Call emergency services if person shows confusion, difficulty breathing, fruity breath odor, or losing consciousness.\n10. Gather information about medication, last food intake, and symptoms for emergency responders.",
        
        "allergic reaction": "1. Call emergency services (911) immediately for severe reactions (difficulty breathing, swelling of face/throat, dizziness).\n2. If person has an epinephrine auto-injector (EpiPen), help them use it or administer it yourself if trained.\n3. For EpiPen: Remove blue safety cap, place orange tip against outer thigh mid-way between hip and knee, push firmly until click is heard, hold for 3 seconds.\n4. Help person sit up to aid breathing unless they are dizzy or unconscious.\n5. Loosen tight clothing and remove constricting items like jewelry if area is swelling.\n6. Monitor for signs of shock (pale skin, rapid breathing, confusion).\n7. If reaction is mild and limited to skin (hives, itching), an oral antihistamine may help if available.\n8. Apply cold compress to swollen areas for comfort.\n9. Be prepared to administer a second dose of epinephrine after 5-15 minutes if symptoms return before emergency services arrive.\n10. Document exposure details, symptoms, and timing for emergency responders.",
        
        "poison": "1. Call Poison Control Center immediately (1-800-222-1222 in US) or emergency services.\n2. Do not induce vomiting unless specifically instructed by medical professionals.\n3. If poison is on skin: Remove contaminated clothing using gloves and rinse skin with running water for 15-20 minutes.\n4. If poison is in eye: Flush with lukewarm water for 20 minutes, holding eyelids open.\n5. If poison is inhaled: Get to fresh air immediately and open doors and windows if safe to do so.\n6. Bring the poison container, plant, or medication to the phone when calling for help.\n7. For unconscious person with suspected poisoning: Check breathing and circulation, begin CPR if necessary, place in recovery position if breathing.\n8. Do not give salt water, ipecac syrup, or home remedies - these can worsen the situation.\n9. Save any vomit for medical analysis if possible.\n10. Follow Poison Control or emergency services instructions exactly.",
        
        // Pediatric Emergencies
        "child choking": "1. For child over 1 year: Determine if choking is mild (can cough or speak) or severe (cannot cough, speak, or breathe).\n2. For mild choking: Encourage coughing but monitor closely - do not interfere with child's own efforts to expel object.\n3. For severe choking: Stand or kneel behind child (depending on size).\n4. Give 5 back blows between shoulder blades with heel of hand.\n5. If unsuccessful, give 5 abdominal thrusts (Heimlich maneuver): Place fist thumb-side just above navel, grasp with other hand, pull inward and upward.\n6. Alternate between 5 back blows and 5 abdominal thrusts until object is expelled.\n7. If child becomes unconscious: Carefully lower to ground, call emergency services, begin CPR.\n8. When giving CPR to choking child, look in mouth before giving breaths and remove object only if you can see it.\n9. Continue until emergency help arrives or object is expelled and child begins breathing normally.\n10. Seek medical attention after any serious choking incident, even if resolved.",
        
        "infant choking": "1. Determine if choking is mild (can cough, cry, or breathe) or severe (cannot cough, cry, or breathe).\n2. For mild choking: Monitor closely but allow infant to cough - do not interfere with infant's efforts to clear airway.\n3. For severe choking: Call emergency services or have someone call while you begin first aid.\n4. Place infant face down along your forearm, supporting head and jaw with your hand.\n5. Keep infant's head lower than their body.\n6. Give 5 firm back blows between shoulder blades using heel of hand.\n7. If unsuccessful: Turn infant face up on your forearm, supporting head. Give 5 chest thrusts (press down on center of chest with 2-3 fingers, about 1 finger-width below nipple line).\n8. Check mouth after each set of back blows/chest thrusts and remove object only if clearly visible.\n9. Alternate 5 back blows and 5 chest thrusts until object is expelled or infant becomes unconscious.\n10. For unconscious infant: Begin infant CPR, looking in mouth before giving breaths.",
        
        "fever child": "1. Measure temperature accurately using age-appropriate method (rectal for infants under 3 months, temporal artery or tympanic for older children).\n2. For high fever (over 102°F/39°C): Give age/weight-appropriate dose of acetaminophen or ibuprofen (not aspirin, and no ibuprofen for infants under 6 months).\n3. Keep child hydrated with cool fluids - offer small amounts frequently.\n4. Dress in light clothing - single layer is usually sufficient.\n5. Keep room temperature comfortable (not too hot or cold).\n6. For comfort, sponge with lukewarm water (not cold alcohol baths - these can be dangerous).\n7. Monitor for signs of dehydration: dry mouth, no tears when crying, decreased urination.\n8. Document fever pattern, timing, and response to medication.\n9. Do not bundle in heavy blankets or clothing, even if child has chills.\n10. Seek immediate medical care for: fever in infant under 3 months, fever over 104°F (40°C), fever with rash, stiff neck, severe headache, confusion, difficulty breathing, persistent vomiting, or fever lasting more than 2-3 days.",
        
        // Environmental Emergencies
        "heat exhaustion": "1. Move person to cool place immediately - preferably air-conditioned environment.\n2. Remove excess clothing and loosen tight clothing.\n3. Cool the body with cool (not cold) wet cloths on head, neck, armpits, and groin.\n4. Mist with cool water while fanning the person to enhance cooling.\n5. If person is alert and not nauseated, provide cool water to drink - small sips every 15 minutes.\n6. For electrolyte replacement, provide sports drinks diluted with equal parts water.\n7. Help person lie down and elevate feet slightly.\n8. Monitor body temperature if possible and continue cooling efforts until temperature drops below 101°F (38.3°C).\n9. If no improvement in 30 minutes, or symptoms worsen (confusion, inability to drink, vomiting, loss of consciousness), seek emergency medical care.\n10. After recovery, person should avoid heat and strenuous activity for at least 24-48 hours.",
        
        "heatstroke": "1. Call emergency services (911) immediately - heatstroke is life-threatening.\n2. Move person to cooler place out of direct sunlight.\n3. Remove outer clothing and any constrictive items.\n4. Cool person aggressively: immerse in cool water if possible or cover with cool, wet sheets.\n5. Apply ice packs to armpits, groin, neck, and back - areas with blood vessels close to skin.\n6. Fan continuously to enhance cooling through evaporation.\n7. Monitor body temperature if possible and continue cooling until temperature drops to 102°F (38.9°C).\n8. If person is alert and can swallow, offer small sips of cool water (no alcohol or caffeine).\n9. For seizures: Protect from injury but do not restrain; do not place anything in mouth.\n10. If unconscious but breathing: Place in recovery position (on side) while continuing cooling efforts.",
        
        "hypothermia": "1. Call emergency services (911) immediately for moderate to severe hypothermia.\n2. Move person to warm, dry location and remove wet clothing.\n3. Handle gently - rough movement can trigger cardiac arrest in severe hypothermia.\n4. Warm center of body first - chest, neck, head, groin.\n5. Use dry layers of blankets, clothing, or towels for insulation.\n6. If outdoors, insulate the person from the ground and cover head.\n7. For mild hypothermia (alert person): Provide warm, sweet, non-alcoholic drinks and high-energy food if possible.\n8. For moderate to severe hypothermia: Apply warm, dry compresses to neck, chest wall, and groin; do not apply heat to extremities.\n9. Use skin-to-skin contact under dry blankets/clothing if other warming methods unavailable.\n10. Monitor breathing carefully - if breathing stops or is ineffective, begin CPR.",
        
        "drowning": "1. Ensure your safety first - do not attempt rescue beyond your capabilities.\n2. Call emergency services (911) immediately.\n3. If safely possible, remove person from water - minimize movement of head and neck if diving/trauma suspected.\n4. Check for consciousness and breathing.\n5. If not breathing: Begin CPR immediately - start with 5 rescue breaths, then continue standard CPR.\n6. Continue CPR until the person responds or emergency services arrive.\n7. If breathing: Place in recovery position (on side) to prevent aspiration if vomiting occurs.\n8. Remove wet clothing and keep person warm with dry blankets or clothing.\n9. Do not induce vomiting or give alcohol (harmful myths about drowning).\n10. All drowning victims need medical evaluation, even if they seem fine - secondary drowning can occur hours later.",
        
        // Mental Health Emergencies
        "suicidal": "1. Take all suicide threats or attempts seriously - never ignore or minimize them.\n2. Call emergency services (911) or the National Suicide Prevention Lifeline (988) immediately.\n3. Stay with the person - do not leave them alone under any circumstances.\n4. Remove access to means of self-harm (weapons, medications, sharp objects, etc.).\n5. Listen without judgment or negative reactions - avoid saying things like 'you have so much to live for.'\n6. Speak calmly and express concern: 'I care about you and want you to stay alive.'\n7. Don't promise confidentiality - be honest that you need to get help.\n8. Avoid debating whether suicide is right or wrong, or making the person feel guilty.\n9. Ask directly about suicide plans - this does not increase risk and helps assess danger level.\n10. Encourage professional help, offering to help make calls or accompany them to appointments.",
        
        "panic attack": "1. Stay with the person and maintain a calm, reassuring presence.\n2. Speak in short, simple sentences in a gentle voice.\n3. Help the person focus on taking slow, deep breaths - breathe with them: in for 4 counts, hold for 2, out for 6.\n4. Reassure that panic attacks are not life-threatening and will pass, typically within 20-30 minutes.\n5. Ask permission before touching - some people find gentle pressure on arm or shoulder grounding, others may feel trapped.\n6. Help reduce stimulation - move to quieter, less crowded space if possible.\n7. Encourage grounding techniques: name 5 things they can see, 4 they can touch, 3 they can hear, 2 they can smell, 1 they can taste.\n8. Avoid saying phrases like 'calm down' or 'there's nothing to worry about.'\n9. After attack subsides, offer water and quiet support.\n10. If this is a first attack, symptoms are unusual or severe, or person has heart condition, seek medical evaluation.",
        
        // Additional common emergencies
        "burn": "1. Ensure scene safety and stop the burning process - remove from heat source.\n2. Remove jewelry and tight items near burn before swelling develops.\n3. Cool the burn with cool (not cold) running water for 10-15 minutes - do not use ice.\n4. Do not apply butter, oil, toothpaste, or other home remedies - these can worsen damage and increase infection risk.\n5. For minor burns: After cooling, apply moisturizing lotion and cover loosely with sterile, non-stick bandage.\n6. For chemical burns: Brush off dry chemicals first, then flush with running water for 20 minutes.\n7. For electrical burns: Ensure power source is off before touching person, check for entry and exit wounds.\n8. Take over-the-counter pain reliever if needed for pain management.\n9. Keep burn area elevated if possible to reduce swelling.\n10. Seek medical attention for: burns larger than 3 inches; burns on face, hands, feet, genitals; third-degree burns (white or charred appearance); chemical or electrical burns; or if victim is very young or elderly.",
        
        "eye injury": "1. Do NOT rub, touch, or apply pressure to the injured eye.\n2. For chemical splashes: Immediately flush with clean, lukewarm water for 15-20 minutes, holding eyelid open. Aim water flow from inner corner outward.\n3. For embedded object: Do NOT attempt removal. Stabilize the object - cover both eyes with cups (paper cups with bottoms cut out) to prevent eye movement.\n4. For cuts/punctures: Shield eye with rigid protection (paper cup bottom, egg carton) without pressure. Cover both eyes to prevent sympathetic movement.\n5. For blows to eye: Apply cold compress without pressure for 15-20 minutes to reduce swelling. Do not apply directly to eyeball.\n6. For small foreign body sensation: Blink several times. If particle remains, pull upper lid over lower lid and release.\n7. If particle still remains: Flush gently with clean water or saline solution.\n8. For all serious eye injuries: Keep person lying flat, minimize eye movement, avoid food and drink in case anesthesia is needed.\n9. Do not apply eye drops or ointment without medical direction.\n10. Seek immediate medical attention for all significant eye injuries - vision preservation depends on prompt treatment.",
        
        "sprain": "1. Follow the RICE protocol: Rest, Ice, Compression, Elevation.\n2. Rest: Stop using the injured area. Use crutches for lower limb injuries if walking is necessary.\n3. Ice: Apply cold pack wrapped in thin cloth for 20 minutes every 2-3 hours during first 48-72 hours.\n4. Compression: Apply elastic bandage from below injury upward, firm but not tight enough to impair circulation.\n5. Elevation: Keep injured area above heart level when possible to reduce swelling.\n6. Take over-the-counter anti-inflammatory medication if not contraindicated (ibuprofen, naproxen).\n7. Avoid heat, alcohol, and massage during first 48 hours - these can increase swelling and bleeding.\n8. Check for circulation beyond injury site - if fingers/toes become cold, numb, or blue, loosen bandage.\n9. After 48 hours, gentle movement can begin unless painful.\n10. Seek medical attention if: unable to bear weight, severe pain persists, significant swelling/bruising, or if you hear/feel a 'pop' at time of injury.",
        
        "unconscious": "1. Call emergency services (911) immediately.\n2. Check for breathing and pulse - if absent, begin CPR.\n3. If breathing, place in recovery position: roll onto side, position dependent arm at right angle to body, other arm across chest, bend upper leg.\n4. Maintain open airway by tilting head back slightly and lifting chin.\n5. Check for external signs of injury, especially head trauma.\n6. Do not give anything by mouth - risk of choking/aspiration.\n7. Check for medical ID jewelry or cards that might indicate cause.\n8. Protect from extreme temperatures - cover with blanket if cool environment.\n9. Document any changes in condition while waiting for help.\n10. If vomiting occurs, carefully turn entire body as unit to side to prevent aspiration.",
        
        "nosebleed": "1. Have person sit upright and lean slightly forward - do not tilt head back or lie down.\n2. Loosen tight clothing around neck and apply cold compress to bridge of nose.\n3. Pinch the soft part of the nose just below the bony ridge firmly for 10-15 minutes continuously.\n4. Breathe through mouth during this time.\n5. After releasing pressure, avoid sniffing, blowing nose, or inserting anything into nostril for several hours.\n6. If bleeding persists after 20 minutes of pressure, reapply pressure for another 10-15 minutes.\n7. For additional help slowing persistent bleeding, spray an over-the-counter nasal decongestant into nostril.\n8. Avoid strenuous activity, hot beverages, and spicy foods for 24 hours after bleeding stops.\n9. Apply petroleum jelly inside nostril after bleeding stops to prevent dryness.\n10. Seek medical attention if: bleeding doesn't stop after 30 minutes, nosebleed follows head injury, bleeding is extremely heavy, person is on blood thinners, or nosebleeds are frequent."
      };
      
      // Multiple pass pattern matching for better emergency detection
      let foundMatch = false;
      let guidance = "";
      const lowerEmergencyText = emergencyText.toLowerCase();
      
      // First try to find exact phrase matches
      for (const [key, value] of Object.entries(redCrossProtocols)) {
        if (lowerEmergencyText.includes(key)) {
          guidance = value;
          foundMatch = true;
          break;
        }
      }
      
      // If no exact match, try to find partial matches
      if (!foundMatch) {
        for (const [key, value] of Object.entries(redCrossProtocols)) {
          const keywords = key.split(' ');
          for (const word of keywords) {
            if (word.length > 3 && lowerEmergencyText.includes(word)) {
              guidance = value;
              foundMatch = true;
              break;
            }
          }
          if (foundMatch) break;
        }
      }
      
      // Fallback for no matches
      if (!foundMatch) {
        guidance = "1. Assess the situation for danger to yourself or others.\n2. Call emergency services (911) immediately if there's any doubt about severity.\n3. Keep the person still and comfortable until help arrives.\n4. Monitor breathing and consciousness.\n5. If trained and needed, begin CPR or other appropriate first aid measures.\n6. Gather information about what happened and any symptoms for emergency responders.\n7. Reassure the person and keep them calm.\n8. Do not give food or drink unless specifically advised.\n9. Help the person maintain normal body temperature.\n10. Stay with the person until emergency services arrive.";
      }
      
      // Format any unformatted guidance into steps
      const formattedGuidance = guidance;
      
      setLoading(false);
      return formattedGuidance;
    } catch (error) {
      setLoading(false);
      console.error("Error retrieving guidance:", error);
      return "Error retrieving emergency guidance. Please call emergency services (911) immediately.";
    }
  };

  return {
    data,
    loading,
    addEmergencyEntry,
    addMedicalRecord,
    editMedicalRecord,
    deleteMedicalRecord,
    requestsPersonalInfo,
    formatGuidanceAsSteps,
    processFollowUpAnswer,
    requestGuidance
  };
}

export default useEmergencyData;
