
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
import { encryptData } from '@/utils/encryption';

interface QRCodeGeneratorProps {
  medicalRecord: MedicalRecord;
}

const QRCodeGenerator = ({ medicalRecord }: QRCodeGeneratorProps) => {
  const [copied, setCopied] = useState(false);
  
  // Create a reduced set of data for the QR code - only essential emergency info
  const essentialInfo = {
    name: medicalRecord.fullName,
    emergency_code: medicalRecord.emergencyCode || "N/A",
    blood: medicalRecord.bloodGroup,
    allergies: medicalRecord.allergies || "None reported",
    ec_name: medicalRecord.emergencyContact || "Not provided",
    ec_phone: medicalRecord.emergencyPhone || "Not provided",
  };
  
  // Use a more secure string format for QR data - include only essential info
  const emergencyQrData = `EMERGENCY:${medicalRecord.emergencyCode || "N/A"}`;

  // Generate text for display/copy but not for QR code
  const emergencyInfo = `EMERGENCY MEDICAL INFO:
Code: ${medicalRecord.emergencyCode || "N/A"}
Name: ${medicalRecord.fullName}
Blood Group: ${medicalRecord.bloodGroup}
Emergency Contact: ${medicalRecord.emergencyContact || "Not provided"}
Emergency Phone: ${medicalRecord.emergencyPhone || "Not provided"}

For additional medical information, please contact emergency services
and provide the emergency code above.`;

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
            <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded-md text-xs">
              <p className="text-yellow-700">For privacy protection, this QR code contains only your emergency code. Medical personnel can use this code to request your complete information.</p>
            </div>
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
              value={emergencyQrData}
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
