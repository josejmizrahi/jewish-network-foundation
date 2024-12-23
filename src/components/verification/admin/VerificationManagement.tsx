import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import type { VerificationRequest } from "@/types/verification";

interface ProfileData {
  full_name: string | null;
  email: string | null;
}

interface VerificationRequestWithProfile extends VerificationRequest {
  profiles: ProfileData;
}

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
      return data as VerificationRequestWithProfile[];
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
        {requests?.map((request) => (
          <Card key={request.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-medium">{request.profiles.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  Submitted: {format(new Date(request.submitted_at), 'PPp')}
                </p>
                <Badge 
                  variant={
                    request.status === 'approved' 
                      ? 'default'
                      : request.status === 'rejected'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {request.status}
                </Badge>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedRequestId(request.id)}
                disabled={request.status !== 'pending'}
              >
                Review
              </Button>
            </div>

            {selectedRequestId === request.id && (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={status}
                    onValueChange={(value: "approved" | "rejected") => setStatus(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">
                        <div className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          Approve
                        </div>
                      </SelectItem>
                      <SelectItem value="rejected">
                        <div className="flex items-center">
                          <XCircle className="mr-2 h-4 w-4 text-red-500" />
                          Reject
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Review Notes</label>
                  <Textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add your review notes here..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedRequestId(null);
                      setReviewNotes("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => updateRequest()}
                    disabled={isUpdating}
                  >
                    {isUpdating && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit Review
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
