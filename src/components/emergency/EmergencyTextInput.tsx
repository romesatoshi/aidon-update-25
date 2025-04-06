
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Icons from "../Icons";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import ContextualSuggestions from "./ContextualSuggestions";

interface EmergencyTextInputProps {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  calmingMessage: string;
  onReset: () => void;
  onSuggestionSelect: (suggestion: string) => void;
}

export function EmergencyTextInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  calmingMessage,
  onReset,
  onSuggestionSelect
}: EmergencyTextInputProps) {
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  
  const { 
    isListening, 
    transcript, 
    isSupported, 
    startListening, 
    stopListening
  } = useSpeechRecognition({
    onResult: (result) => {
      onChange(result);
    }
  });

  const handleSuggestionSelect = (suggestion: string) => {
    if (value.trim()) {
      onChange(value + "\n" + suggestion);
    } else {
      onChange(suggestion);
    }
    
    setConversationContext(prev => [...prev, suggestion]);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Textarea
          placeholder="Describe the emergency specifically (e.g., 'person unconscious after fall' or 'child choking on food')"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[100px] p-4 resize-none transition-all focus-visible:ring-primary"
          disabled={isLoading || isListening}
        />
        
        {(value || isListening) && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 opacity-70 hover:opacity-100 transition-opacity"
            onClick={onReset}
            disabled={isLoading}
            aria-label="Clear input"
          >
            <Icons.close className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {value && !isLoading && (
        <ContextualSuggestions 
          currentEmergency={value}
          onSuggestionSelect={onSuggestionSelect}
        />
      )}
      
      <div className="flex flex-col gap-3">
        <Button
          className={cn(
            "flex-1 bg-emergency hover:bg-emergency-hover text-emergency-foreground",
            isLoading && "animate-pulse-subtle"
          )}
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
        >
          <Icons.emergency className="mr-2 h-4 w-4" />
          {isLoading ? calmingMessage || "Getting guidance..." : "Get Specific First Aid Steps"}
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
    </div>
  );
}

export default EmergencyTextInput;
