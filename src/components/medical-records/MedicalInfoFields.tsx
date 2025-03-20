
import { FormField } from "./FormField";
import { FormData } from "./useFormState";
import { DatePicker } from "./DatePicker";
import { Select } from "@/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MedicalInfoFieldsProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function MedicalInfoFields({ formData, handleInputChange }: MedicalInfoFieldsProps) {
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const event = {
        target: {
          name: "dateOfBirth",
          value: date.toISOString().split('T')[0]
        }
      } as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(event);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField
          id="bloodGroup"
          label="Blood Group"
          placeholder="e.g., A+, O-, AB+"
          value={formData.bloodGroup}
          onChange={handleInputChange}
          required
        >
          <Select 
            name="bloodGroup" 
            value={formData.bloodGroup} 
            onValueChange={(value) => {
              const event = {
                target: { name: "bloodGroup", value }
              } as React.ChangeEvent<HTMLSelectElement>;
              handleInputChange(event);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          id="genotype"
          label="Genotype"
          placeholder="e.g., AA, AS, SS"
          value={formData.genotype}
          onChange={handleInputChange}
        >
          <Select 
            name="genotype" 
            value={formData.genotype} 
            onValueChange={(value) => {
              const event = {
                target: { name: "genotype", value }
              } as React.ChangeEvent<HTMLSelectElement>;
              handleInputChange(event);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select genotype" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AA">AA</SelectItem>
              <SelectItem value="AS">AS</SelectItem>
              <SelectItem value="AC">AC</SelectItem>
              <SelectItem value="SS">SS</SelectItem>
              <SelectItem value="SC">SC</SelectItem>
              <SelectItem value="CC">CC</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField
          id="hivStatus"
          label="HIV Status"
          placeholder="Select HIV Status"
          value={formData.hivStatus}
          onChange={handleInputChange}
        >
          <Select 
            name="hivStatus" 
            value={formData.hivStatus} 
            onValueChange={(value) => {
              const event = {
                target: { name: "hivStatus", value }
              } as React.ChangeEvent<HTMLSelectElement>;
              handleInputChange(event);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select HIV status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Positive">Positive</SelectItem>
              <SelectItem value="Negative">Negative</SelectItem>
              <SelectItem value="Unknown">Unknown</SelectItem>
              <SelectItem value="Prefer not to disclose">Prefer not to disclose</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          id="dateOfBirth"
          label="Date of Birth"
          placeholder="YYYY-MM-DD"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
        >
          <DatePicker 
            date={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined} 
            onSelect={handleDateChange}
          />
        </FormField>
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
