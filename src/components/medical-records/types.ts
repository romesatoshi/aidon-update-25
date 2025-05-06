
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
  emergencyCode: string;
  genotype: string;
  hivStatus: string;
  hepatitisStatus: string;
  // Authentication fields
  verifiedBy?: string;
  verificationDate?: string;
  digitalSignature?: string;
  verificationStatus?: 'unverified' | 'pending' | 'verified';
  // Medical images
  medicalImages?: MedicalImage[];
}

export interface MedicalImage {
  id: string;
  name: string;
  type: 'xray' | 'report' | 'other';
  description?: string;
  dataUrl: string;
  uploadDate: string;
}

export interface MedicalRecordFormProps { 
  onClose: () => void;
  onSave?: (record: MedicalRecord) => void;
  initialData?: MedicalRecord;
}
