
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icons from "./Icons";
import { type MedicalRecord } from "./medical-records/types";
import MedicalRecordForm from "./medical-records/MedicalRecordForm";
import QRCodeGenerator from "./QRCodeGenerator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface MedicalRecordsListProps {
  records: MedicalRecord[];
  onClose: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (record: MedicalRecord) => void;
}

export function MedicalRecordsList({ 
  records, 
  onClose, 
  onDelete, 
  onEdit 
}: MedicalRecordsListProps) {
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const toggleRecordDetails = (id: string) => {
    if (expandedRecord === id) {
      setExpandedRecord(null);
    } else {
      setExpandedRecord(id);
    }
  };

  const handleEdit = (record: MedicalRecord) => {
    setEditingRecord(record);
  };

  const handleSaveEdit = (updatedRecord: MedicalRecord) => {
    if (onEdit) {
      onEdit(updatedRecord);
    }
    setEditingRecord(null);
  };

  const confirmDelete = (id: string) => {
    setRecordToDelete(id);
  };

  const handleConfirmDelete = () => {
    if (recordToDelete && onDelete) {
      onDelete(recordToDelete);
      toast({
        title: "Record deleted",
        description: "The medical record has been permanently removed.",
      });
    }
    setRecordToDelete(null);
  };

  const cancelDelete = () => {
    setRecordToDelete(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (editingRecord) {
    return (
      <div className="p-4 border-t">
        <MedicalRecordForm 
          onClose={() => setEditingRecord(null)} 
          onSave={handleSaveEdit}
          initialData={editingRecord}
        />
      </div>
    );
  }

  return (
    <div className="p-4 border-t">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium flex items-center">
          <Icons.fileText className="mr-2 h-4 w-4" />
          Saved Medical Records
        </h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          aria-label="Close records list"
        >
          <Icons.close className="h-4 w-4" />
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
                <div className="flex justify-between items-center">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => toggleRecordDetails(record.id)}
                  >
                    <p className="font-medium">{record.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      Blood Group: {record.bloodGroup} • Added: {formatDate(record.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <QRCodeGenerator medicalRecord={record} />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(record)}
                      className="h-8 w-8"
                      aria-label="Edit record"
                    >
                      <Icons.edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => confirmDelete(record.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      aria-label="Delete record"
                    >
                      <Icons.trash className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => toggleRecordDetails(record.id)}
                      className="h-8 w-8"
                    >
                      {expandedRecord === record.id ? (
                        <Icons.chevronDown className="h-4 w-4" />
                      ) : (
                        <Icons.chevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
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

      <AlertDialog open={recordToDelete !== null} onOpenChange={(isOpen) => !isOpen && setRecordToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Icons.emergency className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this medical record? This action cannot be undone and the information will be permanently lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default MedicalRecordsList;
