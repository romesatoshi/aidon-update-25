
import { useState, useEffect, useRef } from "react";

// Add interface for the WebkitSpeechRecognition since TypeScript doesn't have built-in types for it
interface IWindow extends Window {
  SpeechRecognition?: typeof SpeechRecognition;
  webkitSpeechRecognition?: typeof SpeechRecognition;
}

type SpeechRecognitionOptions = {
  onResult?: (result: string) => void;
};

export function useSpeechRecognition(options?: SpeechRecognitionOptions) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const windowWithSpeech = window as IWindow;
    
    if (windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition) {
      const SpeechRecognitionAPI = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const currentTranscript = event.results[0][0].transcript;
          setTranscript(currentTranscript);
          setIsListening(false);
          
          if (options?.onResult) {
            options.onResult(currentTranscript);
          }
        };
        
        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };
        
        setIsSupported(true);
      }
    }
    
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [options]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (error) {
        console.error("Failed to stop speech recognition:", error);
      }
    }
  };

  return {
    isListening,
    startListening,
    stopListening,
    transcript,
    setTranscript,
    isSupported
  };
}

export default useSpeechRecognition;
