import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppealForm } from "./AppealForm";
import { format } from "date-fns";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import type { VerificationRequest } from "@/types/verification";

export function VerificationHistory() {
  const { user } = useAuth();
  const [showAppealForm, setShowAppealForm] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const { data: requests, refetch } = useQuery({
    queryKey: ["verification-requests", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verification_requests")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as VerificationRequest[];
    },
    enabled: !!user?.id,
    refetchInterval: 5000, // Refetch every 5 seconds to keep status updated
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const handleAppealSubmitted = () => {
    setShowAppealForm(false);
    refetch();
  };

  if (!requests?.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(request.status)}
              <div>
                <div className="font-medium">
                  Status: {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(request.created_at), "PPP")}
                </div>
                {request.reviewer_notes && (
                  <div className="text-sm mt-1">{request.reviewer_notes}</div>
                )}
              </div>
            </div>
            {request.status === "rejected" && (
              <Dialog open={showAppealForm} onOpenChange={setShowAppealForm}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedRequestId(request.id)}
                  >
                    Appeal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Appeal Verification Decision</DialogTitle>
                  </DialogHeader>
                  {selectedRequestId && (
                    <AppealForm
                      verificationRequestId={selectedRequestId}
                      onAppealSubmitted={handleAppealSubmitted}
                    />
                  )}
                </DialogContent>
              </Dialog>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}