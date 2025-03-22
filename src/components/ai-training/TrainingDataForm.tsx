
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/medical-records/FormField";
import { useToast } from "@/hooks/use-toast";
import Icons from "@/components/Icons";

export interface TrainingData {
  emergencyScenario: string;
  category: string;
  expectedGuidance: string;
  source: string;
  timestamp: string;
}

interface TrainingDataFormProps {
  onSubmit: (data: TrainingData) => void;
}

const emergencyCategories = [
  { value: 'cardiac', label: 'Cardiac Emergency' },
  { value: 'respiratory', label: 'Respiratory Emergency' },
  { value: 'trauma', label: 'Trauma' },
  { value: 'burn', label: 'Burns' },
  { value: 'poisoning', label: 'Poisoning' },
  { value: 'neurological', label: 'Neurological Emergency' },
  { value: 'allergic', label: 'Allergic Reaction' },
  { value: 'other', label: 'Other Emergency' },
];

const TrainingDataForm = ({ onSubmit }: TrainingDataFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    emergencyScenario: '',
    category: '',
    expectedGuidance: '',
    source: 'manual',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.emergencyScenario || !formData.category || !formData.expectedGuidance) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit({
      ...formData,
      timestamp: new Date().toISOString(),
    });
    
    // Reset form
    setFormData({
      emergencyScenario: '',
      category: '',
      expectedGuidance: '',
      source: 'manual',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        id="emergencyScenario"
        label="Emergency Scenario"
        required
      >
        <Textarea
          placeholder="Describe an emergency scenario in detail (e.g., 'Child has fallen from bicycle and has a deep cut on knee')"
          value={formData.emergencyScenario}
          onChange={(e) => setFormData({ ...formData, emergencyScenario: e.target.value })}
          className="min-h-[80px]"
        />
      </FormField>
      
      <FormField
        id="category"
        label="Emergency Category"
        required
      >
        <Select
          value={formData.category || undefined}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {emergencyCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      
      <FormField
        id="expectedGuidance"
        label="Expected Guidance"
        required
      >
        <Textarea
          placeholder="Enter the correct first aid guidance for this emergency"
          value={formData.expectedGuidance}
          onChange={(e) => setFormData({ ...formData, expectedGuidance: e.target.value })}
          className="min-h-[120px]"
        />
      </FormField>
      
      <div className="pt-4">
        <Button type="submit" className="flex items-center gap-2">
          <Icons.plus className="h-4 w-4" />
          Add Training Data
        </Button>
      </div>
    </form>
  );
};

export default TrainingDataForm;
