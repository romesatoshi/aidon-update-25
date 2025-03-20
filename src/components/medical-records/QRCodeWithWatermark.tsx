
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { QRCode } from "react-qrcode-logo";
import { Button } from "@/components/ui/button";
import { MedicalRecord } from "./types";

interface QRCodeWithWatermarkProps {
  record: MedicalRecord;
}

const QRCodeWithWatermark: React.FC<QRCodeWithWatermarkProps> = ({ record }) => {
  const [showData, setShowData] = useState(false);

  const toggleDataVisibility = () => {
    setShowData(!showData);
  };

  const qrCodeValue = showData
    ? JSON.stringify(record)
    : JSON.stringify({
        emergencyCode: record.emergencyCode,
        fullName: record.fullName,
        bloodGroup: record.bloodGroup,
      });

  return (
    <div className="relative">
      <QRCode
        value={qrCodeValue}
        size={256}
        level="H"
        logoImage="/heart.png"
        logoWidth={64}
        logoHeight={64}
        logoOpacity={0.8}
      />
      <div className="absolute top-2 left-2 bg-white rounded-full p-2 shadow">
        <Button variant="ghost" size="icon" onClick={toggleDataVisibility}>
          {showData ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="absolute bottom-2 right-2 bg-white text-xs text-gray-600 rounded-md p-1 shadow">
        Scan for {showData ? "full" : "emergency"} data
      </div>
    </div>
  );
};

export default QRCodeWithWatermark;
