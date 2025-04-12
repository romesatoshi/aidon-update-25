import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import useSpeechSynthesis from "@/hooks/useSpeechSynthesis";
import Icons from "./Icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalizedGuidanceTab from "./PersonalizedGuidanceTab";
import { MedicalRecord } from "./medical-records/types";
import PharmaceuticalRecommendations from "./PharmaceuticalRecommendations";

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
  medicalRecords?: MedicalRecord[];
  onPersonalizeGuidance?: (record: MedicalRecord | null) => void;
}

export function GuidanceDisplay({ 
  guidance, 
  onReset, 
  className,
  additionalInfo,
  personalizedInfo,
  medicalRecords = [],
  onPersonalizeGuidance
}: GuidanceDisplayProps) {
  const { isSupported, isSpeaking, speak, cancel } = useSpeechSynthesis();
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const handleSpeak = () => {
    let textToSpeak = guidance.replace(/\n/g, '. '); // Replace line breaks with pauses for speech
    
    if (additionalInfo && Object.keys(additionalInfo).length > 0) {
      textToSpeak += ". Additional information: ";
      for (const [question, answer] of Object.entries(additionalInfo)) {
        if (answer.trim()) {
          textToSpeak += `${question}: ${answer}. `;
        }
      }
    }
    
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

  const handleSelectMedicalRecord = (record: MedicalRecord | null) => {
    setSelectedRecordId(record?.id || null);
    if (onPersonalizeGuidance) {
      onPersonalizeGuidance(record);
    }
  };

  const formatGuidanceDisplay = (text: string) => {
    if (text.includes('\n')) {
      const steps = text.split('\n').filter(step => step.trim().length > 0);
      return (
        <ol className="list-decimal pl-5 space-y-2">
          {steps.map((step, index) => (
            <li key={index} className="text-balance">{step}</li>
          ))}
        </ol>
      );
    }
    
    return <p className="text-balance">{text}</p>;
  };

  if (!guidance) return null;

  return (
    <div className="space-y-4">
      <Card className={cn("animate-scale-in border-l-4 border-l-primary", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <Icons.emergency className="mr-2 h-5 w-5 text-emergency" />
            Emergency Guidance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formatGuidanceDisplay(guidance)}
            
            <Tabs defaultValue="additional" className="w-full mt-4">
              <TabsList className="w-full grid grid-cols-3 mb-2">
                <TabsTrigger value="additional">Additional Details</TabsTrigger>
                <TabsTrigger value="personalized">Personalize</TabsTrigger>
                <TabsTrigger value="supplies">Medical Supplies</TabsTrigger>
              </TabsList>
              
              <TabsContent value="additional" className="pt-2">
                {additionalInfo && Object.keys(additionalInfo).length > 0 ? (
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Additional Information:</h3>
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
                ) : (
                  <div className="text-sm text-muted-foreground">
                    <p className="flex items-center">
                      <Icons.info className="h-4 w-4 mr-2" />
                      No additional details were provided
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="personalized" className="pt-2">
                <PersonalizedGuidanceTab 
                  medicalRecords={medicalRecords}
                  onSelectRecord={handleSelectMedicalRecord}
                  selectedRecordId={selectedRecordId}
                />
                
                {personalizedInfo && Object.values(personalizedInfo).some(value => 
                  value && (Array.isArray(value) ? value.length > 0 : true)) && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-medium text-sm mb-2">Applied Medical Considerations:</h3>
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
              </TabsContent>
              
              <TabsContent value="supplies" className="pt-2">
                <div className="text-sm">
                  <PharmaceuticalRecommendations guidance={guidance} />
                </div>
              </TabsContent>
            </Tabs>
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
    </div>
  );
}

export default GuidanceDisplay;
