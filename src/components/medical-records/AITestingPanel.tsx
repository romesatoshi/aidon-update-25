
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Icons from "@/components/Icons";

interface AITestingPanelProps {
  onTestComplete?: (result: { input: string; output: string; accuracy: number }) => void;
}

const AITestingPanel: React.FC<AITestingPanelProps> = ({ onTestComplete }) => {
  const [testInput, setTestInput] = useState("");
  const [testResult, setTestResult] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const { toast } = useToast();

  const runAITest = () => {
    if (!testInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a medical emergency scenario to test.",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    setTestProgress(0);
    setTestResult("");

    // Simulate AI processing
    const interval = setInterval(() => {
      setTestProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Generate a simulated response based on the input
          const responses = [
            "Apply direct pressure to the wound using a clean cloth or bandage to control bleeding. Elevate the injured area above the level of the heart if possible. Call emergency services if bleeding is severe or doesn't stop after 15 minutes of pressure.",
            "Administer CPR immediately. Place hands in the center of the chest and perform 30 chest compressions followed by 2 rescue breaths. Continue until emergency services arrive.",
            "Move the person to a cool place. Remove excess clothing and apply cool water to the skin. Fan the person to increase cooling. Provide cold water to drink if the person is conscious. Call emergency services for severe symptoms.",
            "Have the person sit or lie down. Loosen tight clothing. Have them breathe slowly and deeply. If symptoms persist or worsen, seek medical attention immediately.",
          ];
          
          // Select a response based on some keywords in the input
          let responseIndex = 0;
          if (testInput.toLowerCase().includes("bleeding") || testInput.toLowerCase().includes("cut")) {
            responseIndex = 0;
          } else if (testInput.toLowerCase().includes("heart") || testInput.toLowerCase().includes("chest pain")) {
            responseIndex = 1;
          } else if (testInput.toLowerCase().includes("heat") || testInput.toLowerCase().includes("temperature")) {
            responseIndex = 2;
          } else if (testInput.toLowerCase().includes("anxiety") || testInput.toLowerCase().includes("panic")) {
            responseIndex = 3;
          }
          
          const result = responses[responseIndex];
          setTestResult(result);
          setIsTesting(false);
          
          // Calculate a simulated accuracy score
          const accuracy = 70 + Math.random() * 25; // Between 70% and 95%
          
          if (onTestComplete) {
            onTestComplete({
              input: testInput,
              output: result,
              accuracy: accuracy
            });
          }
          
          toast({
            title: "AI Test Complete",
            description: `Response generated with ${accuracy.toFixed(1)}% confidence.`,
          });
          
          return 100;
        }
        return newProgress;
      });
    }, 100);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center">
          <Icons.brain className="mr-2 h-5 w-5 text-primary" />
          Test AI Response
        </CardTitle>
        <CardDescription>
          Enter a medical emergency scenario to test the AI's response
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe a medical emergency scenario (e.g., 'A person has a deep cut on their arm and it's bleeding heavily')"
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
          className="min-h-[100px]"
          disabled={isTesting}
        />
        
        {isTesting && (
          <div className="space-y-2">
            <div className="flex items-center">
              <Icons.loader className="h-4 w-4 mr-2 animate-spin text-primary" />
              <span className="text-sm">Processing...</span>
            </div>
            <Progress value={testProgress} className="h-2" />
          </div>
        )}
        
        {testResult && (
          <div className="p-4 border rounded-md bg-muted">
            <p className="text-sm font-medium mb-2">AI Response:</p>
            <p className="text-sm">{testResult}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={runAITest} 
          disabled={isTesting} 
          className="w-full"
        >
          {isTesting ? (
            <>
              <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            <>
              <Icons.play className="mr-2 h-4 w-4" />
              Run Test
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AITestingPanel;
