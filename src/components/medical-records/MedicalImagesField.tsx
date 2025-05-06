
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { MedicalImage } from "./types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MedicalImagesFieldProps {
  images: MedicalImage[];
  onAddImage: (image: MedicalImage) => void;
  onRemoveImage: (imageId: string) => void;
}

export function MedicalImagesField({
  images = [],
  onAddImage,
  onRemoveImage
}: MedicalImagesFieldProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [viewImage, setViewImage] = useState<MedicalImage | null>(null);
  const [imageType, setImageType] = useState<'xray' | 'report' | 'other'>('xray');
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Auto-populate name if empty
    if (!name) {
      setName(file.name.split('.')[0]);
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddImage = () => {
    if (!previewImage || !name) return;
    
    const newImage: MedicalImage = {
      id: Date.now().toString(),
      name,
      type: imageType,
      description,
      dataUrl: previewImage,
      uploadDate: new Date().toISOString()
    };
    
    onAddImage(newImage);
    resetForm();
    setShowAddDialog(false);
  };

  const resetForm = () => {
    setPreviewImage(null);
    setName("");
    setImageType('xray');
    setDescription("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Medical Images & Reports</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddDialog(true)}
        >
          Add Image
        </Button>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-8 border rounded-md border-dashed text-muted-foreground bg-muted/30">
          No medical images or reports uploaded
        </div>
      ) : (
        <ScrollArea className="h-[200px] border rounded-md p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="border rounded-md p-2 flex flex-col"
              >
                <div
                  className="h-24 bg-cover bg-center rounded cursor-pointer mb-2"
                  style={{ backgroundImage: `url(${image.dataUrl})` }}
                  onClick={() => setViewImage(image)}
                ></div>
                <div className="text-xs font-medium truncate">{image.name}</div>
                <div className="text-xs text-muted-foreground">{image.type} • {formatDate(image.uploadDate)}</div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-1 text-xs text-destructive hover:text-destructive"
                  onClick={() => onRemoveImage(image.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Add Image Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Medical Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Image</label>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {previewImage && (
              <div className="border rounded-md overflow-hidden h-48 flex justify-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="object-contain h-full"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="X-ray Chest AP"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={imageType} onValueChange={(val: 'xray' | 'report' | 'other') => setImageType(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xray">X-ray</SelectItem>
                  <SelectItem value="report">Medical Report</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the image"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddImage} disabled={!previewImage || !name}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Image Dialog */}
      <Dialog open={!!viewImage} onOpenChange={(open) => !open && setViewImage(null)}>
        {viewImage && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{viewImage.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border rounded-md overflow-hidden flex justify-center max-h-[60vh]">
                <img
                  src={viewImage.dataUrl}
                  alt={viewImage.name}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Type:</span> {viewImage.type}
                </div>
                <div>
                  <span className="font-medium">Upload Date:</span> {formatDate(viewImage.uploadDate)}
                </div>
                {viewImage.description && (
                  <div className="col-span-2">
                    <span className="font-medium">Description:</span> {viewImage.description}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewImage(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
