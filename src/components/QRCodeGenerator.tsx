
import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { type MedicalRecord } from "./medical-records/types";
import Icons from "./Icons";
import { toast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  medicalRecord: MedicalRecord | null;
}

export function QRCodeGenerator({ medicalRecord }: QRCodeGeneratorProps) {
  const [qrValue, setQrValue] = useState<string>("");
  const [emergencyCode, setEmergencyCode] = useState<string>("");

  useEffect(() => {
    if (medicalRecord) {
      // Generate emergency code if not already existing
      let code = medicalRecord.emergencyCode;
      if (!code) {
        // Generate a unique emergency code - 8 character alphanumeric
        code = generateEmergencyCode();
      }
      setEmergencyCode(code);

      const qrData = {
        name: medicalRecord.fullName,
        bloodGroup: medicalRecord.bloodGroup,
        age: medicalRecord.age || "Not specified",
        sex: medicalRecord.sex || "Not specified",
        allergies: medicalRecord.allergies || "None",
        conditions: medicalRecord.conditions || "None",
        medications: medicalRecord.medications || "None",
        emergencyContact: medicalRecord.emergencyContact || "None",
        emergencyPhone: medicalRecord.emergencyPhone || "None",
        emergencyCode: code
      };
      
      setQrValue(JSON.stringify(qrData));
    }
  }, [medicalRecord]);

  const generateEmergencyCode = (): string => {
    // Generate a random 8-character alphanumeric code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const copyEmergencyCode = () => {
    navigator.clipboard.writeText(emergencyCode);
    toast({
      title: "Emergency code copied",
      description: "The code has been copied to your clipboard"
    });
  };

  if (!medicalRecord) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Icons.qrCode className="h-4 w-4" />
          Emergency QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Emergency Medical Information</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          <Card className="p-4 flex items-center justify-center">
            <QRCodeSVG 
              value={qrValue}
              size={200}
              level="H"
              includeMargin={true}
            />
          </Card>
          
          <div className="mt-4 p-3 bg-muted rounded-md w-full text-center">
            <p className="text-sm font-medium mb-2">Emergency Access Code</p>
            <div className="flex items-center justify-center gap-2">
              <code className="bg-background p-2 rounded text-lg font-bold tracking-wider">
                {emergencyCode}
              </code>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={copyEmergencyCode}
                className="h-8 w-8"
              >
                <Icons.copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Share this code with healthcare providers for emergency access
            </p>
          </div>
          
          <p className="mt-4 text-sm text-center text-muted-foreground">
            This QR code contains your essential medical information for emergency situations.
            <br />
            No sensitive notes are included.
          </p>
          <p className="mt-2 text-xs text-center font-medium">
            Name: {medicalRecord.fullName}
            <br />
            Blood Group: {medicalRecord.bloodGroup}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default QRCodeGenerator;
