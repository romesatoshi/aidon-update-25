
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Icons from "./Icons";
import { cn } from "@/lib/utils";

interface ContextualSuggestionsProps {
  currentEmergency: string;
  onSuggestionSelect: (suggestion: string) => void;
}

const ContextualSuggestions = ({ 
  currentEmergency,
  onSuggestionSelect
}: ContextualSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Generate contextual suggestions based on the current emergency
  useEffect(() => {
    if (!currentEmergency) {
      setSuggestions([]);
      return;
    }
    
    const lowerEmergency = currentEmergency.toLowerCase();
    let contextualSuggestions: string[] = [];
    
    // Contextual follow-up questions based on emergency type
    if (lowerEmergency.includes('chest pain') || lowerEmergency.includes('heart')) {
      contextualSuggestions = [
        "Is the pain radiating to the arm or jaw?",
        "Are they experiencing shortness of breath?",
        "Do they have a history of heart problems?",
        "Have they taken any medication for this?"
      ];
    } else if (lowerEmergency.includes('breathing') || lowerEmergency.includes('asthma')) {
      contextualSuggestions = [
        "Do they have an inhaler available?",
        "Are their lips turning blue?",
        "How long have they been having trouble breathing?",
        "Have they been exposed to any allergens?"
      ];
    } else if (lowerEmergency.includes('fall') || lowerEmergency.includes('fell')) {
      contextualSuggestions = [
        "Did they hit their head?",
        "Can they move all limbs?",
        "Is there any visible bleeding?",
        "Did they lose consciousness at any point?"
      ];
    } else if (lowerEmergency.includes('burn') || lowerEmergency.includes('fire')) {
      contextualSuggestions = [
        "What caused the burn?",
        "How large is the affected area?",
        "Is the skin red, blistered, or charred?",
        "Has cold water been applied to the area?"
      ];
    } else if (lowerEmergency.includes('bleed') || lowerEmergency.includes('blood')) {
      contextualSuggestions = [
        "Where is the bleeding coming from?",
        "Is the bleeding severe or pulsing?",
        "Has direct pressure been applied?",
        "Has the bleeding been going on for more than 15 minutes?"
      ];
    } else if (lowerEmergency.includes('diabetic') || lowerEmergency.includes('sugar')) {
      contextualSuggestions = [
        "When did they last eat?",
        "Have they taken their insulin?",
        "Are they conscious and able to swallow?",
        "Do they have glucose tablets or juice available?"
      ];
    } else if (lowerEmergency.includes('seizure') || lowerEmergency.includes('convulsion')) {
      contextualSuggestions = [
        "How long has the seizure lasted?",
        "Has the person had seizures before?",
        "Are they on medication for seizures?",
        "Did they have any warning signs before the seizure?"
      ];
    } else {
      // General follow-up questions for other emergencies
      contextualSuggestions = [
        "When did the symptoms start?",
        "Is the person conscious and responsive?",
        "Are there any known medical conditions?",
        "Has this happened before?"
      ];
    }
    
    setSuggestions(contextualSuggestions);
  }, [currentEmergency]);

  if (!suggestions.length) return null;

  return (
    <div className="mt-4 space-y-2">
      <p className="text-sm font-medium flex items-center">
        <Icons.helpCircle className="mr-2 h-4 w-4 text-primary" />
        Suggested follow-up questions:
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button 
            key={index}
            variant="outline" 
            size="sm"
            className={cn(
              "text-xs text-left justify-start h-auto py-2 bg-background hover:bg-primary/5",
              "border-primary/20 hover:border-primary/40"
            )}
            onClick={() => onSuggestionSelect(suggestion)}
          >
            <Icons.arrowRight className="mr-1 h-3 w-3 text-primary" />
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ContextualSuggestions;
