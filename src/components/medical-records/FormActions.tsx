
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MedicalRecord } from "./types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import Icons from "../Icons";

interface FormActionsProps {
  loading: boolean;
  isEditing?: boolean;
  record?: MedicalRecord;
}

export function FormActions({ loading, isEditing, record }: FormActionsProps) {
  const [showEmergencyCode, setShowEmergencyCode] = useState(false);

  return (
    <div className="flex justify-between items-center">
      {isEditing && record?.emergencyCode && (
        <Dialog open={showEmergencyCode} onOpenChange={setShowEmergencyCode}>
          <DialogTrigger asChild>
            <Button 
              type="button" 
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <Icons.key className="h-4 w-4" />
              View Emergency Code
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Emergency Code</DialogTitle>
              <DialogDescription>
                This is the unique emergency code for {record.fullName}'s medical record.
                This code is embedded in the QR code and can be used to verify the authenticity of the record.
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 bg-muted rounded-md text-center">
              <p className="text-xl font-mono font-bold tracking-wider">{record.emergencyCode}</p>
            </div>
            <DialogClose asChild>
              <Button type="button" className="w-full mt-4">
                Close
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
      
      <div className={isEditing && record?.emergencyCode ? "ml-auto" : ""}>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {loading 
            ? (isEditing ? "Updating..." : "Saving...") 
            : (isEditing ? "Update Medical Record" : "Save Medical Record")}
        </Button>
      </div>
    </div>
  );
}
