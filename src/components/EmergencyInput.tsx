
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { calmingMessages, followUpQuestions } from "./emergency/constants";
import EmergencyTextInput from "./emergency/EmergencyTextInput";
import FollowUpQuestions from "./emergency/FollowUpQuestions";

interface EmergencyInputProps {
  onSubmit: (text: string) => void;
  onFollowUpSubmit?: (answers: Record<string, string>) => void;
  isLoading: boolean;
  className?: string;
  showFollowUp?: boolean;
  emergencyText?: string;
}

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
  const [calmingMessage, setCalmingMessage] = useState("");
  const [skipCount, setSkipCount] = useState(() => {
    return parseInt(localStorage.getItem("followUpSkipCount") || "0", 10);
  });
  
  useEffect(() => {
    if (showFollowUp && skipCount < 2) {
      determineFollowUpQuestions(emergencyText);
      setIsDrawerOpen(true);
    } else {
      setIsDrawerOpen(false);
    }
  }, [showFollowUp, emergencyText, skipCount]);

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

  const handleSubmit = () => {
    if (text.trim() && !isLoading) {
      onSubmit(text.trim());
    }
  };

  const determineFollowUpQuestions = (inputText: string) => {
    const lowerText = inputText.toLowerCase();
    let questionsToUse = followUpQuestions.default;
    
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
  };

  const handleFollowUpSubmit = (answers: Record<string, string>) => {
    if (onFollowUpSubmit) {
      onFollowUpSubmit(answers);
    }
    setIsDrawerOpen(false);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    const newSkipCount = skipCount + 1;
    setSkipCount(newSkipCount);
    localStorage.setItem("followUpSkipCount", newSkipCount.toString());
    
    if (onFollowUpSubmit) {
      onFollowUpSubmit({});  // Submit empty answers if user closes without answering
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    if (text.trim()) {
      setText(text + "\n" + suggestion);
    } else {
      setText(suggestion);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {!showFollowUp && (
        <EmergencyTextInput
          value={text}
          onChange={setText}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          calmingMessage={calmingMessage}
          onReset={handleReset}
          onSuggestionSelect={handleSuggestionSelect}
        />
      )}

      <FollowUpQuestions
        open={isDrawerOpen}
        questions={currentQuestions}
        onClose={handleCloseDrawer}
        onSubmit={handleFollowUpSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

export default EmergencyInput;
