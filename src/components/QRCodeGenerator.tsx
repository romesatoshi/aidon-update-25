
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

  // Generate concise emergency information with verification
  const emergencyInfo = `EMERGENCY MEDICAL INFO:
Name: ${medicalRecord.fullName}
Age: ${medicalRecord.age}
Blood Type: ${medicalRecord.bloodGroup || "Unknown"}
Allergies: ${medicalRecord.allergies || "None"}
Emergency Contact: ${medicalRecord.emergencyContact || "None"}
Emergency Phone: ${medicalRecord.emergencyPhone || "None"}
${medicalRecord.verificationStatus === 'verified' ? 
  `Verified By: ${medicalRecord.verifiedBy || "Medical Professional"}
  Verified On: ${medicalRecord.verificationDate || new Date().toLocaleDateString()}
  Digital Signature: ${medicalRecord.digitalSignature || "Authenticated"}` : 
  "Authentication Status: Unverified"}`;

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
          <DialogTitle>Essential Emergency Medical QR Code</DialogTitle>
          <DialogDescription>
            This QR code contains critical medical information for quick reference.
            {medicalRecord.verificationStatus === 'verified' && (
              <span className="inline-flex items-center mt-2 text-green-600 gap-1 text-xs">
                <Icons.check className="h-3 w-3" /> Verified medical information
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center p-4">
          <div className={`bg-white p-4 rounded-md ${medicalRecord.verificationStatus === 'verified' ? 'border-2 border-green-500' : ''}`}>
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

        {/* Verification status indicator */}
        <div className="mt-2 p-2 border rounded-md">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Authentication Status:</div>
            <div className="flex items-center">
              {medicalRecord.verificationStatus === 'verified' ? (
                <span className="inline-flex items-center text-green-600 gap-1">
                  <Icons.shield className="h-4 w-4" /> Verified
                </span>
              ) : medicalRecord.verificationStatus === 'pending' ? (
                <span className="inline-flex items-center text-amber-600 gap-1">
                  <Icons.clock className="h-4 w-4" /> Pending Verification
                </span>
              ) : (
                <span className="inline-flex items-center text-gray-500 gap-1">
                  <Icons.alertCircle className="h-4 w-4" /> Unverified
                </span>
              )}
            </div>
          </div>
          
          {medicalRecord.verificationStatus === 'verified' && medicalRecord.verifiedBy && (
            <div className="mt-2 pt-2 border-t text-xs">
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Verified By:</span>
                <span>{medicalRecord.verifiedBy}</span>
              </div>
              {medicalRecord.verificationDate && (
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{medicalRecord.verificationDate}</span>
                </div>
              )}
              {medicalRecord.digitalSignature && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Signature:</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {medicalRecord.digitalSignature.substring(0, 16)}...
                  </span>
                </div>
              )}
            </div>
          )}
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
