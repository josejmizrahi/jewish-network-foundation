import { Button } from "@/components/ui/button";
import { useInvitationManagement } from "@/hooks/useInvitationManagement";
import { CheckCircle, XCircle } from "lucide-react";

interface InvitationActionsProps {
  invitationId: string;
  status: string;
}

export function InvitationActions({ invitationId, status }: InvitationActionsProps) {
  const { handleInvitationResponse } = useInvitationManagement();

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
            Rejected
          </>
        )}
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="default"
        size="sm"
        onClick={() => handleInvitationResponse(invitationId, 'accepted')}
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Accept
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleInvitationResponse(invitationId, 'rejected')}
      >
        <XCircle className="h-4 w-4 mr-2" />
        Reject
      </Button>
    </div>
  );
}