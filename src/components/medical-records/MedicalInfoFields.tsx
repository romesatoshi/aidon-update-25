
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
      
      <FormField
        id="medicationDosage"
        label="Medication Dosage"
        placeholder="Dosage information for medications"
        value={formData.medicationDosage}
        onChange={handleInputChange}
        multiline
      />
      
      <FormField
        id="recentHospitalizations"
        label="Recent Hospitalizations/Surgeries"
        placeholder="Hospitalizations or surgeries in the past year"
        value={formData.recentHospitalizations}
        onChange={handleInputChange}
        multiline
      />
      
      <FormField
        id="primaryPhysician"
        label="Primary Physician"
        placeholder="Name and contact details of primary doctor"
        value={formData.primaryPhysician}
        onChange={handleInputChange}
      />
      
      <FormField
        id="healthInsurance"
        label="Health Insurance Information"
        placeholder="Provider, policy number, etc."
        value={formData.healthInsurance}
        onChange={handleInputChange}
      />
    </>
  );
}
