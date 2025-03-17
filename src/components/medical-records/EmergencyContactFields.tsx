
import { FormField } from "./FormField";
import { FormData } from "./useFormState";

interface EmergencyContactFieldsProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function EmergencyContactFields({ formData, handleInputChange }: EmergencyContactFieldsProps) {
  return (
    <>
      <FormField
        id="emergencyContact"
        label="Emergency Contact"
        placeholder="Emergency contact name"
        value={formData.emergencyContact}
        onChange={handleInputChange}
      />
      
      <FormField
        id="emergencyPhone"
        label="Emergency Phone"
        placeholder="Emergency contact phone"
        value={formData.emergencyPhone}
        onChange={handleInputChange}
      />
      
      <FormField
        id="notes"
        label="Additional Notes"
        placeholder="Any other important medical information..."
        value={formData.notes}
        onChange={handleInputChange}
        multiline
      />
    </>
  );
}
