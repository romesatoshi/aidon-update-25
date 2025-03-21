
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import useSpeechSynthesis from "@/hooks/useSpeechSynthesis";
import Icons from "./Icons";
import { useEffect, useState } from "react";

interface GuidanceDisplayProps {
  guidance: string;
  onReset: () => void;
  className?: string;
  additionalInfo?: Record<string, string>;
  personalizedInfo?: {
    medicalConditions?: string[];
    bloodGroup?: string;
    genotype?: string;
    hivStatus?: string;
    hepatitisStatus?: string;
  };
}

export function GuidanceDisplay({ 
  guidance, 
  onReset, 
  className,
  additionalInfo,
  personalizedInfo
}: GuidanceDisplayProps) {
  const { isSupported, isSpeaking, speak, cancel } = useSpeechSynthesis();
  const [isOffline, setIsOffline] = useState(false);
  const [savedGuidance, setSavedGuidance] = useState<string | null>(null);
  const [savedAdditionalInfo, setSavedAdditionalInfo] = useState<Record<string, string> | null>(null);

  // Check if the browser is online or offline
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Load saved guidance from localStorage when offline
  useEffect(() => {
    if (isOffline && !guidance) {
      const savedData = localStorage.getItem('offlineGuidance');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setSavedGuidance(parsed.guidance);
        setSavedAdditionalInfo(parsed.additionalInfo);
      }
    } else if (guidance) {
      // Save current guidance for offline use
      localStorage.setItem('offlineGuidance', JSON.stringify({
        guidance,
        additionalInfo,
        timestamp: new Date().toISOString()
      }));
    }
  }, [isOffline, guidance, additionalInfo]);

  const handleSpeak = () => {
    let textToSpeak = guidance || savedGuidance || "";
    
    // Add additional info to speech if available
    const infoToUse = additionalInfo || savedAdditionalInfo;
    if (infoToUse && Object.keys(infoToUse).length > 0) {
      textToSpeak += ". Additional information: ";
      for (const [question, answer] of Object.entries(infoToUse)) {
        if (answer.trim()) {
          textToSpeak += `${question}: ${answer}. `;
        }
      }
    }
    
    // Add personalized medical info to speech if available
    if (personalizedInfo) {
      textToSpeak += ". Important personal medical considerations: ";
      if (personalizedInfo.medicalConditions?.length) {
        textToSpeak += `You have ${personalizedInfo.medicalConditions.join(", ")}. `;
      }
      if (personalizedInfo.bloodGroup) {
        textToSpeak += `Your blood group is ${personalizedInfo.bloodGroup}. `;
      }
      if (personalizedInfo.genotype) {
        textToSpeak += `Your genotype is ${personalizedInfo.genotype}. `;
      }
      if (personalizedInfo.hivStatus) {
        textToSpeak += `Your HIV status is ${personalizedInfo.hivStatus}. `;
      }
      if (personalizedInfo.hepatitisStatus) {
        textToSpeak += `Your Hepatitis status is ${personalizedInfo.hepatitisStatus}. `;
      }
    }
    
    if (isSpeaking) {
      cancel();
    } else {
      speak(textToSpeak);
    }
  };

  if (!guidance && !savedGuidance && !isOffline) return null;

  const displayGuidance = guidance || savedGuidance || "";

  return (
    <Card className={cn("animate-scale-in border-l-4 border-l-primary", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Icons.emergency className="mr-2 h-5 w-5 text-emergency" />
          {isOffline && !guidance ? "Offline Emergency Guidance" : "Emergency Guidance"}
          {isOffline && (
            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              Offline Mode
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-balance">{displayGuidance}</p>
          
          {personalizedInfo && Object.values(personalizedInfo).some(value => value && (Array.isArray(value) ? value.length > 0 : true)) && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium text-sm mb-2">Personal Medical Considerations:</h3>
              <ul className="space-y-2 text-sm">
                {personalizedInfo.bloodGroup && (
                  <li className="grid grid-cols-1 gap-1">
                    <span className="font-medium">Blood Group</span>
                    <span className="text-muted-foreground">{personalizedInfo.bloodGroup}</span>
                  </li>
                )}
                {personalizedInfo.genotype && (
                  <li className="grid grid-cols-1 gap-1">
                    <span className="font-medium">Genotype</span>
                    <span className="text-muted-foreground">{personalizedInfo.genotype}</span>
                  </li>
                )}
                {personalizedInfo.hivStatus && (
                  <li className="grid grid-cols-1 gap-1">
                    <span className="font-medium">HIV Status</span>
                    <span className="text-muted-foreground">{personalizedInfo.hivStatus}</span>
                  </li>
                )}
                {personalizedInfo.hepatitisStatus && (
                  <li className="grid grid-cols-1 gap-1">
                    <span className="font-medium">Hepatitis Status</span>
                    <span className="text-muted-foreground">{personalizedInfo.hepatitisStatus}</span>
                  </li>
                )}
                {personalizedInfo.medicalConditions?.length > 0 && (
                  <li className="grid grid-cols-1 gap-1">
                    <span className="font-medium">Medical Conditions</span>
                    <span className="text-muted-foreground">{personalizedInfo.medicalConditions.join(", ")}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
          
          {(additionalInfo || savedAdditionalInfo) && Object.keys(additionalInfo || savedAdditionalInfo || {}).length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium text-sm mb-2">Additional Information:</h3>
              <ul className="space-y-2 text-sm">
                {Object.entries(additionalInfo || savedAdditionalInfo || {}).map(([question, answer], index) => (
                  answer.trim() ? (
                    <li key={index} className="grid grid-cols-1 gap-1">
                      <span className="font-medium">{question}</span>
                      <span className="text-muted-foreground">{answer}</span>
                    </li>
                  ) : null
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between flex-wrap gap-2 pt-2 border-t">
        <p className="text-sm text-muted-foreground">
          <strong className="font-medium">Important:</strong> Call emergency services if the situation is serious
        </p>
        <div className="flex gap-2">
          {isSupported && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSpeak}
              className={cn(isSpeaking && "bg-primary/10")}
            >
              <Icons.voice className="mr-1 h-4 w-4" />
              {isSpeaking ? "Stop Speaking" : "Speak Instructions"}
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReset}
          >
            <Icons.reset className="mr-1 h-4 w-4" />
            New Search
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default GuidanceDisplay;
