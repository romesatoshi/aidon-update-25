
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  loading: boolean;
}

export function FormActions({ loading }: FormActionsProps) {
  return (
    <div className="flex justify-end">
      <Button 
        type="submit" 
        disabled={loading}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {loading ? "Saving..." : "Save Medical Record"}
      </Button>
    </div>
  );
}
