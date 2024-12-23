import { Button } from "@/components/ui/button";
import { Upload, Loader2, X } from "lucide-react";
import { useState } from "react";

interface DocumentUploadProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  documents?: string[];
  onRemoveDocument?: (url: string) => void;
}

export function DocumentUpload({ onFileChange, isUploading, documents = [], onRemoveDocument }: DocumentUploadProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>(documents);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(event);
    
    if (event.target.files) {
      const newPreviewUrls = Array.from(event.target.files).map(file => 
        URL.createObjectURL(file)
      );
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Upload Documents</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {previewUrls.map((url, index) => (
          <div key={url} className="relative group">
            <div className="aspect-square rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
              {url.toLowerCase().endsWith('.pdf') ? (
                <div className="text-center p-4">
                  <p className="text-sm font-medium">PDF Document</p>
                  <p className="text-xs text-muted-foreground">Click to view</p>
                </div>
              ) : (
                <img 
                  src={url} 
                  alt={`Document ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            {onRemoveDocument && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemoveDocument(url)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          disabled={isUploading}
          className="aspect-square relative"
          onClick={() => document.getElementById('document-upload')?.click()}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          <input
            id="document-upload"
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileChange}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Accepted file types: Images (PNG, JPG) and PDF documents
      </p>
    </div>
  );
}