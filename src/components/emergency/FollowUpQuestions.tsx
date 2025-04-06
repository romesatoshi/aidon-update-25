
import { useState } from "react";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import Icons from "../Icons";
import { FormField } from "../medical-records/FormField";

interface FollowUpQuestionsProps {
  open: boolean;
  questions: string[];
  onClose: () => void;
  onSubmit: (answers: Record<string, string>) => void;
  isLoading: boolean;
}

export function FollowUpQuestions({ 
  open, 
  questions, 
  onClose, 
  onSubmit,
  isLoading
}: FollowUpQuestionsProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswerChange = (question: string, answer: string) => {
    setAnswers({
      ...answers,
      [question]: answer
    });
  };

  const handleSubmit = () => {
    onSubmit(answers);
    setAnswers({});
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle className="text-center text-lg font-medium">
            <Icons.emergency className="inline-block mr-2 h-5 w-5 text-emergency" />
            Can You Provide More Details?
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Answering these questions will help us provide more accurate guidance for this emergency:
          </p>
          <div className="space-y-4 max-h-[50vh] overflow-y-auto p-1">
            {questions.map((question, index) => (
              <FormField
                key={index}
                id={`question-${index}`}
                label={question}
                placeholder="Type your answer here..."
                value={answers[question] || ""}
                onChange={(e) => handleAnswerChange(question, e.target.value)}
                className="border-b pb-3"
              />
            ))}
          </div>
        </div>
        <DrawerFooter>
          <Button 
            className="bg-emergency hover:bg-emergency-hover text-emergency-foreground"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            <Icons.emergency className="mr-2 h-4 w-4" />
            Submit Additional Information
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Skip Questions
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default FollowUpQuestions;
