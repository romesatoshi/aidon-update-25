
import React from "react";
import AITestingPanel from "@/components/medical-records/AITestingPanel";
import TestResultsPanel from "@/components/medical-records/TestResultsPanel";

interface AITestingSectionProps {
  testResults: Array<{
    input: string;
    output: string;
    accuracy: number;
  }>;
  onTestComplete: (result: { input: string; output: string; accuracy: number }) => void;
}

const AITestingSection: React.FC<AITestingSectionProps> = ({ 
  testResults, 
  onTestComplete 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AITestingPanel onTestComplete={onTestComplete} />
      <TestResultsPanel testResults={testResults} />
    </div>
  );
};

export default AITestingSection;
