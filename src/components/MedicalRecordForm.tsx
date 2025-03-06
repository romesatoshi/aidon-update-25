
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Icons from "./Icons";

export function MedicalRecordForm({ onClose }: { onClose: () => void }) {
  const [record, setRecord] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!record.trim()) {
      toast({
        title: "Error",
        description: "Please enter medical record information.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // In a real app, this would save to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Success",
        description: "Medical record saved successfully.",
      });
      
      setRecord("");
      onClose();
    } catch (error) {
      console.error("Error saving medical record:", error);
      toast({
        title: "Error",
        description: "Failed to save medical record.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-t">
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
      
      <form onSubmit={handleSubmit}>
        <Textarea
          placeholder="Enter medical record information here..."
          value={record}
          onChange={(e) => setRecord(e.target.value)}
          className="mb-3 min-h-[120px]"
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-primary"
          >
            {loading ? "Saving..." : "Save Record"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default MedicalRecordForm;
