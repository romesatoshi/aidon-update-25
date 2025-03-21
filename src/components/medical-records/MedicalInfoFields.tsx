
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

  return (
    <div className="space-y-4">
      <FormField
        id="bloodGroup"
        label="Blood Group"
        value={values.bloodGroup}
        onChange={onChange}
        options={bloodGroups}
      />
      
      <FormField
        id="genotype"
        label="Genotype"
        value={values.genotype}
        onChange={onChange}
        options={genotypeOptions}
      />
      
      <FormField
        id="hivStatus"
        label="HIV Status"
        value={values.hivStatus}
        onChange={onChange}
        options={statusOptions}
      />
      
      <FormField
        id="hepatitisStatus"
        label="Hepatitis Status"
        value={values.hepatitisStatus}
        onChange={onChange}
        options={statusOptions}
      />
      
      <FormField
        id="recentHospitalizations"
        label="Recent Hospitalizations"
        value={values.recentHospitalizations}
        onChange={onChange}
      />
      
      <FormField
        id="allergies"
        label="Allergies"
        value={values.allergies}
        onChange={onChange}
      />
      
      <FormField
        id="conditions"
        label="Medical Conditions"
        value={values.conditions}
        onChange={onChange}
      />
      
      <FormField
        id="medications"
        label="Medications"
        value={values.medications}
        onChange={onChange}
      />
      
      <FormField
        id="medicationDosage"
        label="Medication Dosage"
        value={values.medicationDosage}
        onChange={onChange}
      />
      
      <FormField
        id="advanceDirectives"
        label="Advance Directives"
        value={values.advanceDirectives}
        onChange={onChange}
      />
      
      <FormField
        id="organDonor"
        label="Organ Donor"
        value={values.organDonor}
        onChange={onChange}
      />
      
      <FormField
        id="notes"
        label="Additional Notes"
        value={values.notes}
        onChange={onChange}
      />
    </div>
  );
};

export default MedicalInfoFields;
