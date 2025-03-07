
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  loading: boolean;
  isEditing?: boolean;
}

export function FormActions({ loading, isEditing }: FormActionsProps) {
  return (
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
  );
}
