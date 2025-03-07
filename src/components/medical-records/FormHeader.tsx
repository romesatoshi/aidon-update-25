
import { Button } from "@/components/ui/button";
import Icons from "../Icons";

interface FormHeaderProps {
  onClose: () => void;
  title?: string;
}

export function FormHeader({ onClose, title = "Add Medical Record" }: FormHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-medium">{title}</h3>
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
