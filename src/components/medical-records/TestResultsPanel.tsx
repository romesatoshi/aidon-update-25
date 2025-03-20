
import React from "react";
import Icons from "@/components/Icons";

interface TestResultsPanelProps {
  testResults: Array<{
    input: string;
    output: string;
    accuracy: number;
  }>;
}

const TestResultsPanel: React.FC<TestResultsPanelProps> = ({ testResults }) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div className="px-4 py-3 border-b">
        <h2 className="text-lg font-medium flex items-center">
          <Icons.history className="mr-2 h-5 w-5" />
          Recent AI Test Results
        </h2>
      </div>
      
      <div className="p-4">
        {testResults.length > 0 ? (
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div key={index} className="border rounded-md p-3">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Test #{index + 1}</span>
                  <span className="text-xs font-medium text-primary">
                    {result.accuracy.toFixed(1)}% accurate
                  </span>
                </div>
                <p className="text-sm font-medium mt-2 mb-1">Query:</p>
                <p className="text-xs text-muted-foreground mb-2">{result.input}</p>
                <p className="text-sm font-medium mb-1">Response:</p>
                <p className="text-xs text-muted-foreground">{result.output}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground text-sm">No test results yet</p>
            <p className="text-xs mt-1">Test the AI to see results here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestResultsPanel;
