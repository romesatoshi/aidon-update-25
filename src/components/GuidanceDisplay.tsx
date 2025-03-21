
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import useSpeechSynthesis from "@/hooks/useSpeechSynthesis";
import Icons from "./Icons";

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

  const handleSpeak = () => {
    let textToSpeak = guidance;
    
    // Add additional info to speech if available
    if (additionalInfo && Object.keys(additionalInfo).length > 0) {
      textToSpeak += ". Additional information: ";
      for (const [question, answer] of Object.entries(additionalInfo)) {
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
    }
    
    if (isSpeaking) {
      cancel();
    } else {
      speak(textToSpeak);
    }
  };

  if (!guidance) return null;

  return (
    <Card className={cn("animate-scale-in border-l-4 border-l-primary", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Icons.emergency className="mr-2 h-5 w-5 text-emergency" />
          Emergency Guidance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-balance">{guidance}</p>
          
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
          
          {additionalInfo && Object.keys(additionalInfo).length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium text-sm mb-2">Additional Information:</h3>
              <ul className="space-y-2 text-sm">
                {Object.entries(additionalInfo).map(([question, answer], index) => (
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
