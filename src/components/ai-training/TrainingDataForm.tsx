
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  confidence?: number;
  validated?: boolean;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    emergencyScenario: '',
    category: '',
    expectedGuidance: '',
    source: 'manual',
  });
  const [uploadMode, setUploadMode] = useState<'manual' | 'file'>('manual');
  const [isUploading, setIsUploading] = useState(false);

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
      confidence: 0.5, // Initial confidence score for manual entries
      validated: false, // Requires validation
    });
    
    // Reset form
    setFormData({
      emergencyScenario: '',
      category: '',
      expectedGuidance: '',
      source: 'manual',
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // For CSV file parsing - in a real app, we'd use a library like Papa Parse
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        const text = await file.text();
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        // Find column indices
        const scenarioIdx = headers.findIndex(h => 
          h.toLowerCase().includes('scenario') || h.toLowerCase().includes('emergency'));
        const categoryIdx = headers.findIndex(h => 
          h.toLowerCase().includes('category') || h.toLowerCase().includes('type'));
        const guidanceIdx = headers.findIndex(h => 
          h.toLowerCase().includes('guidance') || h.toLowerCase().includes('instruction'));
        
        if (scenarioIdx === -1 || categoryIdx === -1 || guidanceIdx === -1) {
          throw new Error("CSV format not recognized. Please ensure it has scenario, category, and guidance columns.");
        }
        
        // Parse and validate sample data (first row after header)
        if (lines.length > 1) {
          const sampleData = lines[1].split(',');
          
          // Set form with sample data
          setFormData({
            emergencyScenario: sampleData[scenarioIdx]?.trim() || '',
            category: sampleData[categoryIdx]?.trim() || 'other',
            expectedGuidance: sampleData[guidanceIdx]?.trim() || '',
            source: 'file',
          });
          
          toast({
            title: "File Processed",
            description: `Found ${lines.length - 1} training scenarios. First one loaded for review.`,
          });
        }
      } else if (file.type === 'application/json') {
        const content = await file.text();
        const json = JSON.parse(content);
        
        // Assuming JSON format has these fields
        if (json.scenario && json.category && json.guidance) {
          setFormData({
            emergencyScenario: json.scenario,
            category: json.category,
            expectedGuidance: json.guidance,
            source: 'file',
          });
          
          toast({
            title: "JSON Processed",
            description: "Training data loaded for review.",
          });
        } else {
          throw new Error("JSON format not recognized. Please ensure it has scenario, category, and guidance fields.");
        }
      } else {
        throw new Error("Unsupported file format. Please upload CSV or JSON files.");
      }
    } catch (error) {
      toast({
        title: "File Upload Error",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2 mb-6">
        <Button
          type="button"
          variant={uploadMode === 'manual' ? 'default' : 'outline'}
          onClick={() => setUploadMode('manual')}
          className="flex-1"
        >
          <Icons.edit className="mr-2 h-4 w-4" />
          Manual Entry
        </Button>
        <Button
          type="button"
          variant={uploadMode === 'file' ? 'default' : 'outline'}
          onClick={() => setUploadMode('file')}
          className="flex-1"
        >
          <Icons.upload className="mr-2 h-4 w-4" />
          File Upload
        </Button>
      </div>
      
      {uploadMode === 'file' && (
        <div className="border-2 border-dashed border-muted-foreground/20 rounded-md p-8 text-center">
          <div className="space-y-4">
            <Icons.upload className="h-10 w-10 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-medium">Upload Training Data File</h3>
            <p className="text-sm text-muted-foreground">
              Upload CSV or JSON files with emergency scenarios and guidance
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="max-w-xs mx-auto"
            />
            {isUploading && <p className="text-sm text-muted-foreground">Processing file...</p>}
          </div>
        </div>
      )}
      
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
