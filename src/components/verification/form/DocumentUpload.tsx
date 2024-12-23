import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";

interface DocumentUploadProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export function DocumentUpload({ onFileChange, isUploading }: DocumentUploadProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Upload Documents</h3>
      <Button
        variant="outline"
        disabled={isUploading}
        className="w-full relative"
        onClick={() => document.getElementById('document-upload')?.click()}
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4 mr-2" />
        )}
        Upload Verification Documents
        <input
          id="document-upload"
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={onFileChange}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </Button>
      <p className="text-sm text-muted-foreground">
        Accepted file types: Images (PNG, JPG) and PDF documents
      </p>
    </div>
  );
}