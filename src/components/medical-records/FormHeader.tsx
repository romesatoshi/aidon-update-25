
import Icons from "../Icons";
import { Button } from "@/components/ui/button";

interface FormHeaderProps {
  onClose: () => void;
}

export function FormHeader({ onClose }: FormHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-medium flex items-center">
        <Icons.MedicalRecords className="mr-2 h-4 w-4" />
        Add Medical Record
      </h3>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose}
        aria-label="Close form"
      >
        <Icons.Close className="h-4 w-4" />
      </Button>
    </div>
  );
}
