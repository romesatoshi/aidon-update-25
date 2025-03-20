
import { FormField } from "./FormField";
import { FormData } from "./useFormState";

interface PersonalInfoFieldsProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function PersonalInfoFields({ formData, handleInputChange }: PersonalInfoFieldsProps) {
  return (
    <>
      <FormField
        id="fullName"
        label="Full Name"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleInputChange}
        required
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          id="age"
          label="Age"
          placeholder="Enter age"
          value={formData.age}
          onChange={handleInputChange}
        />
        
        <div className="flex flex-col gap-1">
          <label htmlFor="genotype" className="text-xs font-medium mb-1 block">Genotype</label>
          <select
            id="genotype"
            name="genotype"
            value={formData.genotype}
            onChange={handleInputChange}
            className="rounded-md border border-input px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select</option>
            <option value="AA">AA</option>
            <option value="AS">AS</option>
            <option value="SS">SS</option>
            <option value="AC">AC</option>
            <option value="SC">SC</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="sex" className="text-xs font-medium mb-1 block">Sex</label>
          <select
            id="sex"
            name="sex"
            value={formData.sex}
            onChange={handleInputChange}
            className="rounded-md border border-input px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-1">
          <label htmlFor="hivStatus" className="text-xs font-medium mb-1 block">HIV Status</label>
          <select
            id="hivStatus"
            name="hivStatus"
            value={formData.hivStatus}
            onChange={handleInputChange}
            className="rounded-md border border-input px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
            <option value="Unknown">Unknown</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          id="weight"
          label="Weight (in kg)"
          placeholder="Weight"
          value={formData.weight}
          onChange={handleInputChange}
        />
        
        <FormField
          id="bloodGroup"
          label="Blood Group"
          placeholder="Blood Group (e.g., A+, O-, AB+)"
          value={formData.bloodGroup}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <FormField
        id="language"
        label="Primary Language"
        placeholder="Language spoken"
        value={formData.language}
        onChange={handleInputChange}
      />
      
      <FormField
        id="address"
        label="Home Address"
        placeholder="Home address"
        value={formData.address}
        onChange={handleInputChange}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="maritalStatus" className="text-xs font-medium mb-1 block">Marital Status</label>
          <select
            id="maritalStatus"
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleInputChange}
            className="rounded-md border border-input px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
            <option value="Separated">Separated</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-1">
          <label htmlFor="dateOfBirth" className="text-xs font-medium mb-1 block">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="rounded-md border border-input px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="organDonor" className="text-xs font-medium mb-1 block">Organ Donor Status</label>
          <select
            id="organDonor"
            name="organDonor"
            value={formData.organDonor}
            onChange={handleInputChange}
            className="rounded-md border border-input px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-1">
          <label htmlFor="advanceDirectives" className="text-xs font-medium mb-1 block">Advance Directives/DNR</label>
          <select
            id="advanceDirectives"
            name="advanceDirectives"
            value={formData.advanceDirectives}
            onChange={handleInputChange}
            className="rounded-md border border-input px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select</option>
            <option value="Yes, DNR">Yes, DNR (Do Not Resuscitate)</option>
            <option value="Yes, Living Will">Yes, Living Will</option>
            <option value="Yes, Healthcare Proxy">Yes, Healthcare Proxy</option>
            <option value="No">No</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
      </div>
    </>
  );
}
