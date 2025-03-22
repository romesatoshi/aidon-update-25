
import { useState, useEffect } from "react";
import { MedicalRecord } from "./medical-records/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Icons from "./Icons";

interface PersonalizedGuidanceTabProps {
  medicalRecords: MedicalRecord[];
  onSelectRecord: (record: MedicalRecord | null) => void;
  selectedRecordId: string | null;
}

export function PersonalizedGuidanceTab({ 
  medicalRecords, 
  onSelectRecord,
  selectedRecordId
}: PersonalizedGuidanceTabProps) {
  
  // Get the selected record
  const selectedRecord = selectedRecordId 
    ? medicalRecords.find(r => r.id === selectedRecordId) 
    : null;

  // Handle select change
  const handleRecordSelect = (recordId: string) => {
    const record = recordId 
      ? medicalRecords.find(r => r.id === recordId) || null
      : null;
    onSelectRecord(record);
  };
  
  // Create a summary of key medical considerations from the selected record
  const getMedicalConsiderations = (record: MedicalRecord) => {
    const considerations = [];
    
    if (record.conditions) considerations.push(record.conditions);
    if (record.allergies) considerations.push(`Allergies: ${record.allergies}`);
    if (record.medications) considerations.push(`Medications: ${record.medications}`);
    
    return considerations;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="record-select" className="text-sm font-medium">
          Apply Personal Medical Context
        </label>
        
        {medicalRecords.length === 0 ? (
          <div className="text-sm text-muted-foreground border p-3 rounded-md bg-muted/20">
            <p className="flex items-center">
              <Icons.info className="h-4 w-4 mr-2 text-muted-foreground" />
              No medical records available. Add medical records to personalize guidance.
            </p>
          </div>
        ) : (
          <>
            <Select
              value={selectedRecordId || ""}
              onValueChange={handleRecordSelect}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a medical record" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None - General guidance</SelectItem>
                {medicalRecords.map((record) => (
                  <SelectItem key={record.id} value={record.id}>
                    {record.fullName || "Unnamed Record"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedRecord && (
              <div className="mt-4 space-y-3 p-3 border rounded-md bg-muted/10">
                <h4 className="text-sm font-medium flex items-center">
                  <Icons.medicalRecords className="h-4 w-4 mr-2 text-primary" />
                  Medical Profile for {selectedRecord.fullName}
                </h4>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedRecord.bloodGroup && (
                    <Badge variant="outline" className="justify-start font-normal">
                      Blood Group: {selectedRecord.bloodGroup}
                    </Badge>
                  )}
                  {selectedRecord.genotype && (
                    <Badge variant="outline" className="justify-start font-normal">
                      Genotype: {selectedRecord.genotype}
                    </Badge>
                  )}
                  {selectedRecord.hivStatus && selectedRecord.hivStatus !== "Unknown" && (
                    <Badge variant="outline" className="justify-start font-normal">
                      HIV: {selectedRecord.hivStatus}
                    </Badge>
                  )}
                  {selectedRecord.hepatitisStatus && selectedRecord.hepatitisStatus !== "Unknown" && (
                    <Badge variant="outline" className="justify-start font-normal">
                      Hepatitis: {selectedRecord.hepatitisStatus}
                    </Badge>
                  )}
                </div>
                
                {getMedicalConsiderations(selectedRecord).length > 0 && (
                  <div className="text-xs space-y-1">
                    <p className="font-medium">Key Considerations:</p>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                      {getMedicalConsiderations(selectedRecord).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PersonalizedGuidanceTab;
