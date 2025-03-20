
import { FormHeader } from "./FormHeader";
import { FormActions } from "./FormActions";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { MedicalInfoFields } from "./MedicalInfoFields";
import { EmergencyContactFields } from "./EmergencyContactFields";
import { useFormState } from "./useFormState";
import { MedicalRecordFormProps } from "./types";

export function MedicalRecordForm({ onClose, onSave, initialData }: MedicalRecordFormProps) {
  const { formData, loading, handleInputChange, handleSubmit } = useFormState(initialData, onSave, onClose);

  return (
    <div className="p-4 border-t">
      <FormHeader onClose={onClose} title={initialData ? "Edit Medical Record" : "Add Medical Record"} />
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <PersonalInfoFields formData={formData} handleInputChange={handleInputChange} />
        <MedicalInfoFields formData={formData} handleInputChange={handleInputChange} />
        <EmergencyContactFields formData={formData} handleInputChange={handleInputChange} />
        <FormActions loading={loading} isEditing={!!initialData} record={initialData} />
      </form>
    </div>
  );
}

export default MedicalRecordForm;
