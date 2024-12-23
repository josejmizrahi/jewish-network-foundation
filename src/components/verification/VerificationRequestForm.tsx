import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CriteriaList } from "./form/CriteriaList";
import { DocumentUpload } from "./form/DocumentUpload";
import type { VerificationCriteria } from "@/types/verification";

interface VerificationRequestFormProps {
  userId: string;
  onRequestSubmitted?: () => void;
}

export function VerificationRequestForm({ userId, onRequestSubmitted }: VerificationRequestFormProps) {
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const { data: criteria, isLoading: loadingCriteria } = useQuery({
    queryKey: ['verification-criteria'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('verification_criteria')
        .select('*')
        .order('order_position');

      if (error) throw error;
      return data as VerificationCriteria[];
    },
  });

  const { mutate: submitRequest, isPending: isSubmitting } = useMutation({
    mutationFn: async (documents: string[]) => {
      const { error } = await supabase
        .from('verification_requests')
        .insert({
          user_id: userId,
          documents,
          criteria_met: selectedCriteria,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Verification request submitted",
        description: "We'll review your request and get back to you soon.",
      });
      onRequestSubmitted?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit verification request. Please try again.",
        variant: "destructive",
      });
      console.error('Error submitting verification request:', error);
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select a file to upload.');
      }

      const uploadedUrls: string[] = [];
      
      for (const file of event.target.files) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${userId}/verification/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('verification-documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('verification-documents')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      submitRequest(uploadedUrls);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loadingCriteria) {
    return <div>Loading verification criteria...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Verification Request
        </CardTitle>
        <CardDescription>
          Complete the verification checklist and submit required documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <CriteriaList
          criteria={criteria || []}
          selectedCriteria={selectedCriteria}
          onCriteriaChange={setSelectedCriteria}
        />
        <DocumentUpload
          onFileChange={handleFileUpload}
          isUploading={uploading || isSubmitting}
        />
      </CardContent>
    </Card>
  );
}