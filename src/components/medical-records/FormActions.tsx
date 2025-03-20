
import { Button } from "@/components/ui/button";
import { MedicalRecord } from "./types";
import QRCodeWithWatermark from "./QRCodeWithWatermark";

interface FormActionsProps {
  loading: boolean;
  isEditing?: boolean;
  record?: MedicalRecord;
}

export function FormActions({ loading, isEditing, record }: FormActionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
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
      
      {isEditing && record && <QRCodeWithWatermark record={record} />}
    </div>
  );
}
