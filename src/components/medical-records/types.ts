
export interface MedicalRecord {
  id: string;
  fullName: string;
  bloodGroup: string;
  age: string;
  sex: string;
  maritalStatus: string;
  dateOfBirth: string;
  weight: string;
  primaryPhysician: string;
  healthInsurance: string;
  advanceDirectives: string;
  organDonor: string;
  language: string;
  address: string;
  recentHospitalizations: string;
  allergies: string;
  conditions: string;
  medications: string;
  medicationDosage: string;
  emergencyContact: string;
  emergencyPhone: string;
  notes: string;
  createdAt: string;
  emergencyCode: string; // Added this field
}

export interface MedicalRecordFormProps { 
  onClose: () => void;
  onSave?: (record: MedicalRecord) => void;
  initialData?: MedicalRecord;
}
