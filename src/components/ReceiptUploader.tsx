
import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { api } from "@/lib/api";
import { ReceiptData } from "@/types";
import { ImagePlusIcon } from "lucide-react";
import { toast } from "sonner";

interface ReceiptUploaderProps {
  onReceiptProcessed: (data: ReceiptData) => void;
}

const ReceiptUploader = ({ onReceiptProcessed }: ReceiptUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    try {
      setIsUploading(true);
      toast.info("Processing receipt...", { duration: 2000 });
      
      // Call API to process the receipt image
      const receiptData = await api.processReceiptImage(file);
      
      // Pass the extracted data back to parent component
      onReceiptProcessed(receiptData);
    } catch (error) {
      console.error("Error processing receipt:", error);
      toast.error("Failed to process receipt");
    } finally {
      setIsUploading(false);
    }

    // Clean up the object URL
    return () => URL.revokeObjectURL(objectUrl);
  };

  return (
    <div className="mb-4">
      <div className="mb-2 text-sm">Scan Receipt</div>
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <div 
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all hover:bg-muted/50 ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Receipt preview" 
                  className="mx-auto max-h-32 object-contain" 
                />
                <div className="mt-2 text-sm text-muted-foreground">
                  {isUploading ? "Processing..." : "Click to change"}
                </div>
              </div>
            ) : (
              <>
                <ImagePlusIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Upload Receipt Image</p>
                <p className="text-xs text-muted-foreground mt-1">Click to browse or drop an image</p>
              </>
            )}
            <Input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleUpload} 
              disabled={isUploading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptUploader;
