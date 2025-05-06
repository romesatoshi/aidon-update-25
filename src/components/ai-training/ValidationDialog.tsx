
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { TrainingData } from './TrainingDataForm';
import { Badge } from "@/components/ui/badge";
import Icons from "@/components/Icons";

interface ValidationDialogProps {
  trainingData: TrainingData;
  onValidate: (id: string, isValid: boolean, correctedGuidance?: string) => void;
}

const ValidationDialog = ({ trainingData, onValidate }: ValidationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [correctedGuidance, setCorrectedGuidance] = useState(trainingData.expectedGuidance);
  
  const handleValidate = (isValid: boolean) => {
    onValidate(
      trainingData.timestamp, 
      isValid, 
      isValid ? undefined : correctedGuidance
    );
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Icons.check className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Validate Training Data</DialogTitle>
          <DialogDescription>
            Review and validate this training scenario before including it in AI training
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Emergency Scenario:</h3>
            <div className="p-3 bg-muted rounded-md">
              <p>{trainingData.emergencyScenario}</p>
              <Badge variant="outline" className="mt-2">{trainingData.category}</Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Expected Guidance:</h3>
            <Textarea
              value={correctedGuidance}
              onChange={(e) => setCorrectedGuidance(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Source: </h3>
            <p className="text-sm text-muted-foreground">
              {trainingData.source === 'manual' ? 'Manual Entry' : 
               trainingData.source === 'file' ? 'File Upload' : 
               trainingData.source}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => handleValidate(false)}>
            Reject
          </Button>
          <Button onClick={() => handleValidate(true)}>
            Validate & Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ValidationDialog;
