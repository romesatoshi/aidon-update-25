
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

interface EmergencyInputProps {
  onSubmit: (text: string) => void;
  onFollowUpSubmit?: (answers: Record<string, string>) => void;
  isLoading: boolean;
  className?: string;
  showFollowUp?: boolean;
  emergencyText?: string;
}

// Common emergency types and their follow-up questions
const followUpQuestions = {
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
    if (showFollowUp) {
      determineFollowUpQuestions(emergencyText);
      setIsDrawerOpen(true);
    } else {
      setIsDrawerOpen(false);
    }
  }, [showFollowUp, emergencyText]);

  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);

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
  };

  const handleAnswerChange = (question: string, answer: string) => {
    setAnswers({
      ...answers,
      [question]: answer
    });
  };

  const handleFollowUpSubmit = () => {
    if (onFollowUpSubmit) {
      onFollowUpSubmit(answers);
    }
    setIsDrawerOpen(false);
    setAnswers({});
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    if (onFollowUpSubmit) {
      onFollowUpSubmit({}); // Submit empty answers if user closes without answering
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
                <Icons.Close className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button
              className={cn(
                "flex-1 bg-emergency hover:bg-emergency-hover text-emergency-foreground",
                isLoading && "animate-pulse-subtle"
              )}
              onClick={handleSubmit}
              disabled={isLoading || !text.trim()}
            >
              <Icons.Emergency className="mr-2 h-4 w-4" />
              {isLoading ? "Getting guidance..." : "Get Specific First Aid Steps"}
            </Button>
            
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
                <Icons.Voice className="h-4 w-4" />
                {isListening && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="animate-ripple absolute inline-flex h-full w-full rounded-full bg-primary opacity-50"></span>
                  </span>
                )}
              </Button>
            )}
          </div>
        </>
      )}

      <Drawer open={isDrawerOpen} onOpenChange={handleCloseDrawer}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle className="text-center text-lg font-medium">
              <Icons.Emergency className="inline-block mr-2 h-5 w-5 text-emergency" />
              Can You Provide More Details?
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Answering these questions will help us provide more accurate guidance for this emergency:
            </p>
            <div className="space-y-4 max-h-[50vh] overflow-y-auto p-1">
              {currentQuestions.map((question, index) => (
                <FormField
                  key={index}
                  id={`question-${index}`}
                  label={question}
                  placeholder="Type your answer here..."
                  value={answers[question] || ""}
                  onChange={(e) => handleAnswerChange(question, e.target.value)}
                  className="border-b pb-3"
                />
              ))}
            </div>
          </div>
          <DrawerFooter>
            <Button 
              className="bg-emergency hover:bg-emergency-hover text-emergency-foreground"
              onClick={handleFollowUpSubmit}
              disabled={isLoading}
            >
              <Icons.Emergency className="mr-2 h-4 w-4" />
              Submit Additional Information
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCloseDrawer}
            >
              Skip Questions
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default EmergencyInput;
