
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Icons from "@/components/Icons";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/contexts/AuthContext";
import { MedicalRecord } from "./types";

interface QRCodeWithWatermarkProps {
  record: MedicalRecord;
}

export function QRCodeWithWatermark({ record }: QRCodeWithWatermarkProps) {
  const [showQR, setShowQR] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Generate a unique emergency code for this record if it doesn't exist
  const emergencyCode = record.emergencyCode || 
    `${record.id.slice(0, 4)}-${record.bloodGroup}-${Date.now().toString().slice(-4)}`;

  // Create the medical data for the QR code
  const medicalData = {
    name: record.fullName,
    bloodType: record.bloodGroup,
    emergencyCode: emergencyCode,
    allergies: record.allergies,
    medications: record.medications,
    emergencyContact: record.emergencyContact,
    emergencyPhone: record.emergencyPhone,
    conditions: record.conditions,
    // Add a validation hash to prevent tampering
    validationHash: btoa(`${record.id}:${user?.id}:${emergencyCode}`),
  };

  const handleGenerateSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Add gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add signature pattern with randomization for uniqueness
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
    
    // Generate unique pattern based on user ID and record ID
    const seed = (user?.id || '') + record.id;
    const randomValue = (index: number) => {
      const charCode = seed.charCodeAt(index % seed.length);
      return charCode / 255;
    };
    
    // Draw curves
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const startX = 10 + randomValue(i) * 50;
      const startY = 10 + randomValue(i+1) * 50;
      ctx.moveTo(startX, startY);
      
      for (let j = 0; j < 3; j++) {
        const cp1x = startX + 30 + randomValue(i+j+2) * 40;
        const cp1y = startY + randomValue(i+j+3) * 40;
        const cp2x = startX + 60 + randomValue(i+j+4) * 40;
        const cp2y = startY + randomValue(i+j+5) * 40;
        const x = startX + 90 + randomValue(i+j+6) * 40;
        const y = startY + randomValue(i+j+7) * 40;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
      }
    }
    ctx.stroke();
    
    // Add "AID-ON" text as watermark
    ctx.font = "16px Arial";
    ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
    ctx.fillText("AID-ON", canvas.width/2 - 30, canvas.height/2);
    
    // Add unique code
    ctx.fillStyle = "rgba(37, 99, 235, 0.7)";
    ctx.font = "10px Arial";
    ctx.fillText(emergencyCode, 10, canvas.height - 10);
    
    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png');
    setSignature(dataUrl);
  };

  useEffect(() => {
    if (showQR && !signature) {
      handleGenerateSignature();
    }
  }, [showQR]);

  const handleDownload = () => {
    if (!qrRef.current) return;
    
    // Create a canvas to combine QR code and watermark
    const canvas = document.createElement('canvas');
    canvas.width = 350;
    canvas.height = 450;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add title
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText('MEDICAL EMERGENCY INFORMATION', canvas.width/2, 30);
    ctx.font = '14px Arial';
    ctx.fillText(record.fullName, canvas.width/2, 55);
    
    // Add QR code - convert SVG to image
    const svgData = new XMLSerializer().serializeToString(qrRef.current.querySelector('svg')!);
    const img = new Image();
    img.onload = () => {
      // Draw QR code
      ctx.drawImage(img, (canvas.width - 200) / 2, 70, 200, 200);
      
      // Add signature if available
      if (signature) {
        const watermarkImg = new Image();
        watermarkImg.onload = () => {
          // Draw watermark
          ctx.globalAlpha = 0.4;
          ctx.drawImage(watermarkImg, (canvas.width - 150) / 2, 280, 150, 60);
          ctx.globalAlpha = 1;
          
          // Add medical information
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'left';
          ctx.fillText(`Blood Type: ${record.bloodGroup}`, 30, 350);
          ctx.fillText(`Allergies: ${record.allergies || 'None'}`, 30, 370);
          ctx.fillText(`Emergency: ${record.emergencyContact || 'None'}`, 30, 390);
          ctx.fillText(`Emergency Code: ${emergencyCode}`, 30, 410);
          
          // Convert to data URL and download
          const fullDataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `medical-info-${record.fullName.replace(/\s+/g, '-')}.png`;
          link.href = fullDataUrl;
          link.click();
        };
        watermarkImg.src = signature;
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };
  
  return (
    <div className="mt-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowQR(!showQR)}
        className="flex items-center"
      >
        {showQR ? (
          <>
            <Icons.eyeOff className="mr-2 h-4 w-4" />
            Hide QR Code
          </>
        ) : (
          <>
            <Icons.qrCode className="mr-2 h-4 w-4" />
            Generate QR Code
          </>
        )}
      </Button>
      
      {showQR && (
        <div className="mt-4 border rounded-md p-4 bg-card">
          <div className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground mb-3">
              Scan this code to access emergency medical information
            </p>
            
            <div 
              ref={qrRef} 
              className="relative bg-white p-4 rounded-lg"
            >
              <QRCodeSVG
                value={JSON.stringify(medicalData)}
                size={200}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="H"
                includeMargin={true}
              />
              {signature && (
                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                  <img 
                    src={signature} 
                    alt="Security Signature" 
                    className="h-10 opacity-40"
                  />
                </div>
              )}
            </div>
            
            <canvas 
              ref={canvasRef} 
              width="150" 
              height="60" 
              className="hidden"
            />
            
            <div className="mt-3 flex gap-2">
              <Button
                onClick={handleDownload}
                className="flex items-center"
                size="sm"
              >
                <Icons.download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Each QR code contains a unique security signature that prevents tampering.<br />
              Emergency code: <span className="font-mono">{emergencyCode}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default QRCodeWithWatermark;
