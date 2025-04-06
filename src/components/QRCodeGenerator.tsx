
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

  // Generate contextual emergency information with adaptive content
  const emergencyInfo = `EMERGENCY MEDICAL INFO:
Name: ${medicalRecord.fullName}
Age: ${medicalRecord.age}
Blood Type: ${medicalRecord.bloodGroup || "Unknown"}
Allergies: ${medicalRecord.allergies || "None reported"}
Medications: ${medicalRecord.medications || "None reported"}
Medical Conditions: ${medicalRecord.conditions || "None reported"}
Emergency Phone: ${medicalRecord.emergencyPhone || "Not provided"}
Emergency Contact: ${medicalRecord.emergencyContact || "Not provided"}
Special Instructions: ${medicalRecord.notes ? medicalRecord.notes.substring(0, 100) : "None"}
${medicalRecord.genotype ? `Genotype: ${medicalRecord.genotype}` : ""}
${medicalRecord.hivStatus ? `HIV Status: ${medicalRecord.hivStatus}` : ""}
${medicalRecord.hepatitisStatus ? `Hepatitis Status: ${medicalRecord.hepatitisStatus}` : ""}
Emergency Code: ${medicalRecord.emergencyCode || "N/A"}`;

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Adaptive content based on available medical information
  const getDialogTitle = () => {
    const hasCriticalInfo = medicalRecord.bloodGroup && 
      (medicalRecord.conditions || medicalRecord.allergies || medicalRecord.medications);
    
    return hasCriticalInfo 
      ? "Critical Medical Information QR Code" 
      : "Enhanced Emergency Medical QR Code";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center justify-center gap-1"
          title="Generate Emergency QR Code"
        >
          <Icons.qrCode className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            This QR code contains comprehensive emergency medical information for {medicalRecord.fullName}.
            First responders can scan this for critical details during an emergency.
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
        
        <div className="bg-muted p-4 rounded-md max-h-40 overflow-y-auto">
          <pre className="text-xs whitespace-pre-wrap">{emergencyInfo}</pre>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => copyToClipboard(emergencyInfo)}
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
