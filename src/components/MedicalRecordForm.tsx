
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Icons from "./Icons";

// Define the medical record type
export interface MedicalRecord {
  id: string;
  fullName: string;
  bloodGroup: string;
  allergies: string;
  conditions: string;
  medications: string;
  emergencyContact: string;
  emergencyPhone: string;
  notes: string;
  createdAt: string;
}

export function MedicalRecordForm({ onClose, onSave }: { 
  onClose: () => void;
  onSave?: (record: MedicalRecord) => void;
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    bloodGroup: "",
    allergies: "",
    conditions: "",
    medications: "",
    emergencyContact: "",
    emergencyPhone: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.bloodGroup) {
      toast({
        title: "Error",
        description: "Please enter at least full name and blood group.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // In a real app, this would save to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const newRecord: MedicalRecord = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };

      // Call the onSave callback if provided
      if (onSave) {
        onSave(newRecord);
      }
      
      toast({
        title: "Success",
        description: "Medical record saved successfully.",
      });
      
      // Reset form
      setFormData({
        fullName: "",
        bloodGroup: "",
        allergies: "",
        conditions: "",
        medications: "",
        emergencyContact: "",
        emergencyPhone: "",
        notes: ""
      });
      
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
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="fullName" className="text-xs font-medium mb-1 block">Full Name*</label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="bloodGroup" className="text-xs font-medium mb-1 block">Blood Group*</label>
          <Input
            id="bloodGroup"
            name="bloodGroup"
            placeholder="Blood Group (e.g., A+, O-, AB+)"
            value={formData.bloodGroup}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="allergies" className="text-xs font-medium mb-1 block">Allergies</label>
          <Input
            id="allergies"
            name="allergies"
            placeholder="Known allergies"
            value={formData.allergies}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <label htmlFor="conditions" className="text-xs font-medium mb-1 block">Medical Conditions</label>
          <Input
            id="conditions"
            name="conditions"
            placeholder="Existing medical conditions"
            value={formData.conditions}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <label htmlFor="medications" className="text-xs font-medium mb-1 block">Current Medications</label>
          <Input
            id="medications"
            name="medications"
            placeholder="Current medications"
            value={formData.medications}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <label htmlFor="emergencyContact" className="text-xs font-medium mb-1 block">Emergency Contact</label>
          <Input
            id="emergencyContact"
            name="emergencyContact"
            placeholder="Emergency contact name"
            value={formData.emergencyContact}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <label htmlFor="emergencyPhone" className="text-xs font-medium mb-1 block">Emergency Phone</label>
          <Input
            id="emergencyPhone"
            name="emergencyPhone"
            placeholder="Emergency contact phone"
            value={formData.emergencyPhone}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <label htmlFor="notes" className="text-xs font-medium mb-1 block">Additional Notes</label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Any other important medical information..."
            value={formData.notes}
            onChange={handleInputChange}
            className="min-h-[80px]"
          />
        </div>
        
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
