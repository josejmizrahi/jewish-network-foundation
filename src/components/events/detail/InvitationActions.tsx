import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle } from "lucide-react";

interface InvitationActionsProps {
  invitationId: string;
  status: string;
}

export function InvitationActions({ invitationId, status }: InvitationActionsProps) {
  const { toast } = useToast();

  const handleResponse = async (newStatus: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('event_invitations')
        .update({ status: newStatus })
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: `Invitation ${newStatus}`,
        description: `You have ${newStatus} the event invitation.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update invitation.",
        variant: "destructive",
      });
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
        Reject
      </Button>
    </div>
  );
}