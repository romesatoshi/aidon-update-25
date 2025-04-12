
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import Icons from "./Icons";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter
} from "@/components/ui/drawer";
import { FormField } from "./medical-records/FormField";
import useEmergencyData from "@/hooks/useEmergencyData";

interface EmergencyInputProps {
  onSubmit: (text: string) => void;
  onFollowUpSubmit?: (answers: Record<string, string>) => void;
  isLoading: boolean;
  className?: string;
  showFollowUp?: boolean;
  emergencyText?: string;
}

// Calming messages to show during loading
const calmingMessages = [
  "Stay calm, we're getting Red Cross protocol guidance for you...",
  "Take deep breaths. Help is on the way with expert guidance...",
  "Everything will be alright. Getting Red Cross protocols now...",
  "Staying calm helps in emergencies. Finding best protocols...",
  "You're doing great. Preparing step-by-step guidance for you...",
  "Help is coming. We're finding the most accurate protocols...",
  "Keep breathing slowly. Red Cross guidance is being prepared...",
  "You've got this. Getting detailed step-by-step instructions..."
];

// Common emergency types and their follow-up questions based on Red Cross protocols
const followUpQuestions = {
  "unconscious": [
    "Is the person breathing normally?",
    "Did you see what happened before they became unconscious?",
    "How long have they been unconscious?",
    "Are they responding to voice or touch at all?"
  ],
  "fall": [
    "Is there any visible bleeding or deformity?", 
    "Can the person move all limbs?",
    "Did they hit their head during the fall?",
    "What height did they fall from?"
  ],
  "chest pain": [
    "Is the pain radiating to arms, jaw, or back?",
    "Is the person experiencing shortness of breath with the pain?",
    "Is the person sweating, nauseous, or unusually tired?",
    "Does the person have a history of heart problems?"
  ],
  "choking": [
    "Can the person speak or cough at all?",
    "Is the person still conscious and breathing?",
    "What were they eating/doing when choking started?",
    "Has any foreign object been expelled?"
  ],
  "bleeding": [
    "Where is the bleeding coming from specifically?",
    "Is the blood bright red and pulsating or darker and flowing steadily?",
    "How much blood has been lost (e.g., soaked through clothing/towels)?",
    "Is there any foreign object in the wound?"
  ],
  "burn": [
    "What caused the burn (heat, chemical, electrical)?",
    "What percentage of body surface is affected?",
    "What does the burn look like (red, blistered, white/charred)?",
    "Has the burn been cooled with running water?"
  ],
  "default": [
    "Is the person conscious and breathing normally?",
    "When did the symptoms or incident first start?",
    "Has this happened before? If yes, what helped?",
    "Are there any known medical conditions, allergies or medications?"
  ]
};

export function EmergencyInput({ 
  onSubmit, 
  onFollowUpSubmit,
  isLoading, 
  className,
  showFollowUp = false,
  emergencyText = ""
}: EmergencyInputProps) {
  const [text, setText] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [calmingMessage, setCalmingMessage] = useState("");
  const [skipCount, setSkipCount] = useState(() => {
    return parseInt(localStorage.getItem("followUpSkipCount") || "0", 10);
  });
  const [redCrossResponses, setRedCrossResponses] = useState<Record<string, string>>({});
  const { processFollowUpAnswer } = useEmergencyData();
  
  const { 
    isListening, 
    transcript, 
    isSupported, 
    startListening, 
    stopListening, 
    setTranscript 
  } = useSpeechRecognition({
    onResult: (result) => {
      setText(result);
    }
  });

  // Effect to set drawer open state when showFollowUp changes
  useEffect(() => {
    if (showFollowUp && skipCount < 2) {
      determineFollowUpQuestions(emergencyText);
      setIsDrawerOpen(true);
    } else {
      setIsDrawerOpen(false);
    }
  }, [showFollowUp, emergencyText, skipCount]);

  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);

  // Effect to rotate calming messages during loading
  useEffect(() => {
    if (isLoading) {
      const initialMessage = calmingMessages[Math.floor(Math.random() * calmingMessages.length)];
      setCalmingMessage(initialMessage);
      
      const intervalId = setInterval(() => {
        setCalmingMessage(calmingMessages[Math.floor(Math.random() * calmingMessages.length)]);
      }, 3000);
      
      return () => clearInterval(intervalId);
    } else {
      setCalmingMessage("");
    }
  }, [isLoading]);

  // Process answers to generate specific follow-up guidance
  useEffect(() => {
    const processResponses = async () => {
      if (Object.keys(answers).length > 0) {
        const processedResponses: Record<string, string> = {};
        
        for (const [question, answer] of Object.entries(answers)) {
          if (answer.trim()) {
            const response = processFollowUpAnswer(question, answer);
            processedResponses[question] = response;
          }
        }
        
        setRedCrossResponses(processedResponses);
      }
    };
    
    processResponses();
  }, [answers, processFollowUpAnswer]);

  const handleSubmit = () => {
    if (text.trim() && !isLoading) {
      onSubmit(text.trim());
    }
  };

  const determineFollowUpQuestions = (inputText: string) => {
    // Simple text matching to determine emergency type
    const lowerText = inputText.toLowerCase();
    let questionsToUse = followUpQuestions.default;
    
    // Find the most relevant question set
    for (const [keyword, questions] of Object.entries(followUpQuestions)) {
      if (keyword !== "default" && lowerText.includes(keyword)) {
        questionsToUse = questions;
        break;
      }
    }
    
    setCurrentQuestions(questionsToUse);
    return true;
  };

  const handleReset = () => {
    setText("");
    setTranscript("");
    setAnswers({});
    setRedCrossResponses({});
  };

  const handleAnswerChange = (question: string, answer: string) => {
    setAnswers({
      ...answers,
      [question]: answer
    });
  };

  const handleFollowUpSubmit = () => {
    // Enhance answers with protocol-based responses
    const enhancedAnswers = { ...answers };
    
    for (const [question, answer] of Object.entries(answers)) {
      if (answer.trim() && redCrossResponses[question]) {
        enhancedAnswers[`${question} - Red Cross Protocol`] = redCrossResponses[question];
      }
    }
    
    if (onFollowUpSubmit) {
      onFollowUpSubmit(enhancedAnswers);
    }
    
    setIsDrawerOpen(false);
    setAnswers({});
    setRedCrossResponses({});
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // Increment skip count when user skips questions
    const newSkipCount = skipCount + 1;
    setSkipCount(newSkipCount);
    localStorage.setItem("followUpSkipCount", newSkipCount.toString());
    
    if (onFollowUpSubmit) {
      onFollowUpSubmit({});  // Submit empty answers if user closes without answering
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {!showFollowUp && (
        <>
          <div className="relative">
            <Textarea
              placeholder="Describe the emergency specifically (e.g., 'person unconscious after fall' or 'child choking on food')"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[100px] p-4 resize-none transition-all focus-visible:ring-primary"
              disabled={isLoading || isListening}
            />
            
            {(text || isListening) && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 opacity-70 hover:opacity-100 transition-opacity"
                onClick={handleReset}
                disabled={isLoading}
                aria-label="Clear input"
              >
                <Icons.close className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex flex-col gap-3">
            <Button
              className={cn(
                "flex-1 bg-emergency hover:bg-emergency-hover text-emergency-foreground",
                isLoading && "animate-pulse-subtle"
              )}
              onClick={handleSubmit}
              disabled={isLoading || !text.trim()}
            >
              <Icons.emergency className="mr-2 h-4 w-4" />
              {isLoading ? calmingMessage || "Getting Red Cross guidance..." : "Get Step-by-Step First Aid Protocols"}
            </Button>
            
            <div className="flex gap-2 justify-center">
              {isSupported && (
                <Button
                  variant={isListening ? "default" : "outline"}
                  className={cn(
                    "relative",
                    isListening && "bg-primary text-primary-foreground"
                  )}
                  onClick={isListening ? stopListening : startListening}
                  disabled={isLoading}
                >
                  <Icons.voice className="h-4 w-4 mr-2" />
                  {isListening ? "Listening..." : "Speak Emergency"}
                </Button>
              )}
            </div>
          </div>
        </>
      )}

      <Drawer open={isDrawerOpen} onOpenChange={handleCloseDrawer}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle className="text-center text-lg font-medium">
              <Icons.emergency className="inline-block mr-2 h-5 w-5 text-emergency" />
              Critical Follow-Up Assessment
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              These questions follow Red Cross assessment protocols. Your answers will help provide more accurate guidance:
            </p>
            <div className="space-y-4 max-h-[50vh] overflow-y-auto p-1">
              {currentQuestions.map((question, index) => (
                <div key={index} className="space-y-3 border-b pb-4">
                  <FormField
                    id={`question-${index}`}
                    label={question}
                    placeholder="Type your answer here..."
                    value={answers[question] || ""}
                    onChange={(e) => handleAnswerChange(question, e.target.value)}
                  />
                  
                  {answers[question]?.trim() && redCrossResponses[question] && (
                    <div className="mt-2 rounded-md bg-muted p-3 text-sm">
                      <p className="font-medium text-xs text-primary mb-1">Protocol-Based Guidance:</p>
                      <p>{redCrossResponses[question]}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <DrawerFooter>
            <Button 
              className="bg-emergency hover:bg-emergency-hover text-emergency-foreground"
              onClick={handleFollowUpSubmit}
              disabled={isLoading}
            >
              <Icons.emergency className="mr-2 h-4 w-4" />
              Submit Assessment Data
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCloseDrawer}
            >
              Skip Assessment
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default EmergencyInput;
