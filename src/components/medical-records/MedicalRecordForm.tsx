
import { FormHeader } from "./FormHeader";
import { FormActions } from "./FormActions";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { MedicalInfoFields } from "./MedicalInfoFields";
import { EmergencyContactFields } from "./EmergencyContactFields";
import { VerificationFields } from "./VerificationFields";
import { MedicalImagesField } from "./MedicalImagesField";
import { useFormState } from "./useFormState";
import { MedicalRecordFormProps } from "./types";

export function MedicalRecordForm({ onClose, onSave, initialData }: MedicalRecordFormProps) {
  const { 
    formData, 
    loading, 
    handleInputChange, 
    handleSubmit, 
    handleVerificationStatusChange,
    handleAddMedicalImage,
    handleRemoveMedicalImage
  } = useFormState(initialData, onSave, onClose);

  return (
    <div className="p-4 border-t">
      <FormHeader onClose={onClose} title={initialData ? "Edit Medical Record" : "Add Medical Record"} />
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <PersonalInfoFields formData={formData} handleInputChange={handleInputChange} />
        <MedicalInfoFields formData={formData} handleInputChange={handleInputChange} />
        <EmergencyContactFields formData={formData} handleInputChange={handleInputChange} />
        <MedicalImagesField 
          images={formData.medicalImages || []}
          onAddImage={handleAddMedicalImage}
          onRemoveImage={handleRemoveMedicalImage}
        />
        <VerificationFields 
          formData={formData} 
          handleInputChange={handleInputChange} 
          handleVerificationStatusChange={handleVerificationStatusChange}
        />
        <FormActions loading={loading} isEditing={!!initialData} />
      </form>
    </div>
  );
}

export default MedicalRecordForm;
