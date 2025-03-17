
export interface MedicalRecord {
  id: string;
  fullName: string;
  bloodGroup: string;
  age: string;
  sex: string;
  allergies: string;
  conditions: string;
  medications: string;
  emergencyContact: string;
  emergencyPhone: string;
  notes: string;
  createdAt: string;
}

export interface MedicalRecordFormProps { 
  onClose: () => void;
  onSave?: (record: MedicalRecord) => void;
  initialData?: MedicalRecord;
}
