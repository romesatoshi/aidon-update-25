
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import Icons from "./Icons";

interface EmergencyInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
  className?: string;
}

export function EmergencyInput({ onSubmit, isLoading, className }: EmergencyInputProps) {
  const [text, setText] = useState("");
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
      handleSubmit();
    }
  });

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

  const handleReset = () => {
    setText("");
    setTranscript("");
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative">
        <Textarea
          placeholder="Describe the emergency (e.g., 'someone is choking' or 'chest pain')"
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
          {isLoading ? "Getting guidance..." : "Get Emergency Guidance"}
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
    </div>
  );
}

export default EmergencyInput;
