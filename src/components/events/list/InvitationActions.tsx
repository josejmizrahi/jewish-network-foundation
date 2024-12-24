import { Button } from "@/components/ui/button";
import { useInvitationManagement } from "@/hooks/useInvitationManagement";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useState } from "react";

interface InvitationActionsProps {
  invitationId: string;
  status: string;
}

export function InvitationActions({ invitationId, status }: InvitationActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { handleInvitationResponse } = useInvitationManagement();

  const handleResponse = async (newStatus: 'accepted' | 'rejected') => {
    setIsLoading(true);
    try {
      await handleInvitationResponse(invitationId, newStatus);
    } finally {
      setIsLoading(false);
    }
  };

  if (status !== 'pending') {
    return (
      <Button
        variant={status === 'accepted' ? 'default' : 'destructive'}
        size="sm"
        disabled
      >
        {status === 'accepted' ? (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Accepted
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 mr-2" />
            Declined
          </>
        )}
      </Button>
    );
  }

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Processing...
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="default"
        size="sm"
        onClick={() => handleResponse('accepted')}
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Accept
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleResponse('rejected')}
      >
        <XCircle className="h-4 w-4 mr-2" />
        Decline
      </Button>
    </div>
  );
}