import { FormField } from "./FormField";
import { FormData } from "./useFormState";

interface MedicalInfoFieldsProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function MedicalInfoFields({ formData, handleInputChange }: MedicalInfoFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          id="bloodGroup"
          label="Blood Group"
          placeholder="e.g., A+, B-, O+"
          value={formData.bloodGroup}
          onChange={handleInputChange}
          required
        />
        
        <FormField
          id="genotype"
          label="Genotype"
          placeholder="e.g., AA, AS, SS"
          value={formData.genotype}
          onChange={handleInputChange}
        />
        
        <FormField
          id="weight"
          label="Weight (kg)"
          placeholder="Weight in kilograms"
          value={formData.weight}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="hivStatus"
          label="HIV Status"
          type="select"
          value={formData.hivStatus}
          onChange={handleInputChange}
          options={[
            { value: "Unknown", label: "Select status" },
            { value: "Positive", label: "Positive" },
            { value: "Negative", label: "Negative" }
          ]}
        />
        
        <FormField
          id="hepatitisStatus"
          label="Hepatitis Status"
          type="select"
          value={formData.hepatitisStatus}
          onChange={handleInputChange}
          options={[
            { value: "Unknown", label: "Select status" },
            { value: "Positive", label: "Positive" },
            { value: "Negative", label: "Negative" }
          ]}
        />
      </div>
      
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
