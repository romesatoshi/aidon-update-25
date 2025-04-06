
// Calming messages to show during loading
export const calmingMessages = [
  "Stay calm, we're getting guidance for you...",
  "Take deep breaths. Help is on the way...",
  "Everything will be alright. Getting your guidance now...",
  "Staying calm helps in emergencies. Getting information...",
  "You're doing great. Preparing guidance for you...",
  "Help is coming. We're finding the best guidance...",
  "Keep breathing slowly. Guidance is being prepared...",
  "You've got this. We're getting specific steps for you..."
];

// Common emergency types and their follow-up questions
export const followUpQuestions = {
  "unconscious": [
    "Is the person breathing?",
    "Did you see what happened?",
    "How long have they been unconscious?",
    "Are they responding to voice or touch at all?"
  ],
  "fall": [
    "Is there any visible bleeding?", 
    "Can the person move all limbs?",
    "Did they hit their head?",
    "Is there any deformity or swelling?"
  ],
  "chest pain": [
    "Is the pain radiating to arms, jaw, or back?",
    "Is the person experiencing shortness of breath?",
    "Is the person sweating or nauseous?",
    "Does the pain increase with movement or breathing?"
  ],
  "choking": [
    "Can the person speak or cough?",
    "Is the person still conscious?",
    "What were they eating/doing when choking started?",
    "Has any foreign object been expelled?"
  ],
  "bleeding": [
    "Where is the bleeding coming from?",
    "Is the bleeding pulsating or steady?",
    "How much blood has been lost?",
    "Is there any foreign object in the wound?"
  ],
  "burn": [
    "What caused the burn?",
    "What is the size of the burned area?",
    "What does the burn look like (red, blistered, charred)?",
    "Has the burn been cooled with running water?"
  ],
  "default": [
    "Is the person conscious and breathing normally?",
    "When did the symptoms start?",
    "Has this happened before?",
    "Are there any known medical conditions?"
  ]
};
