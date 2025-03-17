
import { FormField } from "./FormField";
import { FormData } from "./useFormState";

interface MedicalInfoFieldsProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function MedicalInfoFields({ formData, handleInputChange }: MedicalInfoFieldsProps) {
  return (
    <>
      <FormField
        id="allergies"
        label="Allergies"
        placeholder="Known allergies"
        value={formData.allergies}
        onChange={handleInputChange}
      />
      
      <FormField
        id="conditions"
        label="Medical Conditions"
        placeholder="Existing medical conditions"
        value={formData.conditions}
        onChange={handleInputChange}
      />
      
      <FormField
        id="medications"
        label="Current Medications"
        placeholder="Current medications"
        value={formData.medications}
        onChange={handleInputChange}
      />
    </>
  );
}
