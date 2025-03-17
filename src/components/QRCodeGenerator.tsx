
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import Icons from './Icons';
import { MedicalRecord } from './medical-records/types';

interface QRCodeGeneratorProps {
  medicalRecord: MedicalRecord;
}

const QRCodeGenerator = ({ medicalRecord }: QRCodeGeneratorProps) => {
  const [copied, setCopied] = useState(false);

  // Generate emergency information string
  const emergencyInfo = `EMERGENCY MEDICAL INFO:
Name: ${medicalRecord.fullName}
Blood Group: ${medicalRecord.bloodGroup}
Age: ${medicalRecord.age}
Sex: ${medicalRecord.sex}
Date of Birth: ${medicalRecord.dateOfBirth || "Not provided"}
Weight: ${medicalRecord.weight || "Not provided"}
Marital Status: ${medicalRecord.maritalStatus || "Not provided"}
Address: ${medicalRecord.address || "Not provided"}
Primary Language: ${medicalRecord.language || "Not provided"}
Allergies: ${medicalRecord.allergies || "None reported"}
Medical Conditions: ${medicalRecord.conditions || "None reported"}
Medications: ${medicalRecord.medications || "None reported"}
Medication Dosage: ${medicalRecord.medicationDosage || "Not provided"}
Recent Hospitalizations: ${medicalRecord.recentHospitalizations || "None reported"}
Primary Physician: ${medicalRecord.primaryPhysician || "Not provided"}
Health Insurance: ${medicalRecord.healthInsurance || "Not provided"}
Advance Directives: ${medicalRecord.advanceDirectives || "Not provided"}
Organ Donor: ${medicalRecord.organDonor || "Not provided"}
Emergency Contact: ${medicalRecord.emergencyContact || "Not provided"}
Emergency Phone: ${medicalRecord.emergencyPhone || "Not provided"}
Emergency Code: ${medicalRecord.emergencyCode || "Not available"}`;

  // Function to copy text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(emergencyInfo)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center justify-center gap-1"
        >
          <Icons.qrCode className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Emergency Medical QR Code</DialogTitle>
          <DialogDescription>
            Scan this QR code to access emergency medical information for {medicalRecord.fullName}.
            {medicalRecord.emergencyCode && (
              <div className="mt-2 p-2 bg-muted rounded-md">
                <p className="text-xs font-mono">Emergency Code: {medicalRecord.emergencyCode}</p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-md">
            <QRCodeSVG 
              value={emergencyInfo}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>
        <div className="bg-muted p-4 rounded-md max-h-32 overflow-y-auto">
          <pre className="text-xs whitespace-pre-wrap">{emergencyInfo}</pre>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={copyToClipboard}
            className="w-full sm:w-auto"
          >
            {copied ? (
              <>
                <Icons.check className="mr-2 h-4 w-4" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Icons.clipboard className="mr-2 h-4 w-4" />
                <span>Copy to Clipboard</span>
              </>
            )}
          </Button>
          <DialogClose asChild>
            <Button type="button" className="w-full sm:w-auto">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeGenerator;
