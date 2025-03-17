
import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { type MedicalRecord } from "./medical-records/MedicalRecordForm";
import Icons from "./Icons";

interface QRCodeGeneratorProps {
  medicalRecord: MedicalRecord | null;
}

export function QRCodeGenerator({ medicalRecord }: QRCodeGeneratorProps) {
  const [qrValue, setQrValue] = useState<string>("");
  
  useEffect(() => {
    if (medicalRecord) {
      // Create a simplified version of the medical record without notes
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
      };
      
      setQrValue(JSON.stringify(qrData));
    }
  }, [medicalRecord]);

  if (!medicalRecord) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Icons.QrCode className="h-4 w-4" />
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
