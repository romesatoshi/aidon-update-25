
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "./FormField";
import { Label } from "@/components/ui/label";
import { Shield, ShieldCheck } from "lucide-react";

interface VerificationFieldsProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleVerificationStatusChange: (value: boolean) => void;
}

export function VerificationFields({ 
  formData, 
  handleInputChange, 
  handleVerificationStatusChange 
}: VerificationFieldsProps) {
  const isVerified = formData.verificationStatus === 'verified';
  
  return (
    <div className="space-y-4 pt-2 border-t">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Record Verification</h3>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="verification-status"
          checked={isVerified}
          onCheckedChange={(checked) => {
            handleVerificationStatusChange(!!checked);
          }}
          className="mt-1"
        />
        <div>
          <Label 
            htmlFor="verification-status"
            className="text-sm font-medium"
          >
            This record has been verified
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Check this box if this medical record has been verified by a medical professional
          </p>
        </div>
      </div>

      {isVerified && (
        <div className="space-y-3 pl-6 border-l-2 border-primary/20">
          <FormField
            id="verifiedBy"
            label="Verified By (Hospital/Doctor name)"
            value={formData.verifiedBy || ""}
            onChange={handleInputChange}
            placeholder="Enter name of verifying hospital or doctor"
            required={isVerified}
          />

          <FormField
            id="verificationDate"
            label="Verification Date"
            value={formData.verificationDate || ""}
            onChange={handleInputChange}
            type="date"
            required={isVerified}
          />

          <FormField
            id="digitalSignature"
            label="Digital Signature/Reference Number"
            value={formData.digitalSignature || ""}
            onChange={handleInputChange}
            placeholder="Enter reference ID or signature"
            required={isVerified}
          />
        </div>
      )}
    </div>
  );
}
