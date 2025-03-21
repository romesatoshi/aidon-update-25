
import React, { ChangeEvent } from 'react';
import { FormField } from './FormField';

interface MedicalInfoFieldsProps {
  values: {
    bloodGroup: string;
    genotype: string;
    hivStatus: string;
    hepatitisStatus: string;
    recentHospitalizations: string;
    allergies: string;
    conditions: string;
    medications: string;
    medicationDosage: string;
    advanceDirectives: string;
    organDonor: string;
    notes: string;
  };
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const MedicalInfoFields: React.FC<MedicalInfoFieldsProps> = ({ values, onChange }) => {
  const bloodGroups = [
    { value: "", label: "Select Blood Group" },
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ];

  const genotypeOptions = [
    { value: "", label: "Select Genotype" },
    { value: "AA", label: "AA" },
    { value: "AS", label: "AS" },
    { value: "SS", label: "SS" },
    { value: "AC", label: "AC" },
    { value: "SC", label: "SC" },
  ];

  const statusOptions = [
    { value: "", label: "Select Status" },
    { value: "Positive", label: "Positive" },
    { value: "Negative", label: "Negative" },
    { value: "Unknown", label: "Unknown" },
  ];

  // Validation function for input fields
  const validateInput = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Sanitize input - basic XSS protection
    const sanitizedValue = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    
    // Create a new event with the sanitized value
    const sanitizedEvent = {
      ...e,
      target: {
        ...e.target,
        value: sanitizedValue,
      },
    } as ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
    
    // Pass the sanitized event to the original onChange handler
    onChange(sanitizedEvent);
  };

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <p className="text-sm text-yellow-700">
          <strong>Privacy Notice:</strong> Medical information is stored locally on your device with basic encryption. 
          For production use, a HIPAA-compliant backend would be required.
        </p>
      </div>
      
      <FormField
        id="bloodGroup"
        label="Blood Group"
        value={values.bloodGroup}
        onChange={validateInput}
        options={bloodGroups}
      />
      
      <FormField
        id="genotype"
        label="Genotype"
        value={values.genotype}
        onChange={validateInput}
        options={genotypeOptions}
      />
      
      <FormField
        id="hivStatus"
        label="HIV Status"
        value={values.hivStatus}
        onChange={validateInput}
        options={statusOptions}
      />
      
      <FormField
        id="hepatitisStatus"
        label="Hepatitis Status"
        value={values.hepatitisStatus}
        onChange={validateInput}
        options={statusOptions}
      />
      
      <FormField
        id="recentHospitalizations"
        label="Recent Hospitalizations"
        value={values.recentHospitalizations}
        onChange={validateInput}
      />
      
      <FormField
        id="allergies"
        label="Allergies"
        value={values.allergies}
        onChange={validateInput}
      />
      
      <FormField
        id="conditions"
        label="Medical Conditions"
        value={values.conditions}
        onChange={validateInput}
      />
      
      <FormField
        id="medications"
        label="Medications"
        value={values.medications}
        onChange={validateInput}
      />
      
      <FormField
        id="medicationDosage"
        label="Medication Dosage"
        value={values.medicationDosage}
        onChange={validateInput}
      />
      
      <FormField
        id="advanceDirectives"
        label="Advance Directives"
        value={values.advanceDirectives}
        onChange={validateInput}
      />
      
      <FormField
        id="organDonor"
        label="Organ Donor"
        value={values.organDonor}
        onChange={validateInput}
      />
      
      <FormField
        id="notes"
        label="Additional Notes"
        value={values.notes}
        onChange={validateInput}
      />
    </div>
  );
};

export default MedicalInfoFields;
