import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ReviewForm } from "./ReviewForm";
import { VerificationRequestsTable } from "./VerificationRequestsTable";
import type { VerificationRequestWithProfile } from "@/types/verification";

export function VerificationManagement() {
  const { toast } = useToast();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [status, setStatus] = useState<"approved" | "rejected">("approved");

  const { data: requests, isLoading } = useQuery({
    queryKey: ['verification-requests-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('verification_requests')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as VerificationRequestWithProfile[];
    },
  });

  const { mutate: updateRequest, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      if (!selectedRequestId) throw new Error("No request selected");

      const { error: requestError } = await supabase
        .from('verification_requests')
        .update({
          status,
          reviewer_notes: reviewNotes,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', selectedRequestId);

      if (requestError) throw requestError;

      if (status === 'approved') {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            verification_status: 'verified',
            role: 'verified_member'
          })
          .eq('id', requests?.find(r => r.id === selectedRequestId)?.user_id);

        if (profileError) throw profileError;
      }

      // Send email notification
      const userId = requests?.find(r => r.id === selectedRequestId)?.user_id;
      if (userId) {
        const emailRes = await supabase.functions.invoke('send-verification-email', {
          body: {
            userId,
            status: status === 'approved' ? 'verified' : 'rejected',
            notes: reviewNotes
          }
        });

        if (emailRes.error) {
          console.error('Error sending email:', emailRes.error);
          toast({
            title: "Warning",
            description: "Status updated but failed to send email notification.",
            variant: "destructive",
          });
        }
      }
    },
    onSuccess: () => {
      toast({
        title: "Request updated",
        description: `Verification request has been ${status}`,
      });
      setSelectedRequestId(null);
      setReviewNotes("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update verification request",
        variant: "destructive",
      });
      console.error('Error updating request:', error);
    },
  });

  if (isLoading) {
    return <div>Loading verification requests...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Requests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <VerificationRequestsTable
          requests={requests || []}
          onSelectRequest={setSelectedRequestId}
        />
        {selectedRequestId && (
          <ReviewForm
            status={status}
            reviewNotes={reviewNotes}
            isUpdating={isUpdating}
            onStatusChange={setStatus}
            onNotesChange={setReviewNotes}
            onSubmit={() => updateRequest()}
            onCancel={() => {
              setSelectedRequestId(null);
              setReviewNotes("");
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}