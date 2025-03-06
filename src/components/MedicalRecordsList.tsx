
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icons from "./Icons";
import { type MedicalRecord } from "./MedicalRecordForm";

interface MedicalRecordsListProps {
  records: MedicalRecord[];
  onClose: () => void;
}

export function MedicalRecordsList({ records, onClose }: MedicalRecordsListProps) {
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  const toggleRecordDetails = (id: string) => {
    if (expandedRecord === id) {
      setExpandedRecord(null);
    } else {
      setExpandedRecord(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="p-4 border-t">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium flex items-center">
          <Icons.FileText className="mr-2 h-4 w-4" />
          Saved Medical Records
        </h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          aria-label="Close records list"
        >
          <Icons.Close className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="h-[350px] pr-3">
        {records.length > 0 ? (
          <div className="space-y-3">
            {records.map((record) => (
              <div 
                key={record.id} 
                className="p-3 rounded-md border bg-card hover:border-primary transition-all"
              >
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleRecordDetails(record.id)}
                >
                  <div>
                    <p className="font-medium">{record.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      Blood Group: {record.bloodGroup} • Added: {formatDate(record.createdAt)}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    {expandedRecord === record.id ? (
                      <Icons.ChevronDown className="h-4 w-4" />
                    ) : (
                      <Icons.ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {expandedRecord === record.id && (
                  <div className="mt-2 pt-2 border-t text-sm space-y-1">
                    {record.allergies && (
                      <p><span className="font-medium">Allergies:</span> {record.allergies}</p>
                    )}
                    {record.conditions && (
                      <p><span className="font-medium">Conditions:</span> {record.conditions}</p>
                    )}
                    {record.medications && (
                      <p><span className="font-medium">Medications:</span> {record.medications}</p>
                    )}
                    {record.emergencyContact && (
                      <p><span className="font-medium">Emergency Contact:</span> {record.emergencyContact}</p>
                    )}
                    {record.emergencyPhone && (
                      <p><span className="font-medium">Emergency Phone:</span> {record.emergencyPhone}</p>
                    )}
                    {record.notes && (
                      <p><span className="font-medium">Notes:</span> {record.notes}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">No medical records available</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default MedicalRecordsList;
