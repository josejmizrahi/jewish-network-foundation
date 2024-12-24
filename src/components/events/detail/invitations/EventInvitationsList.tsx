import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InvitationItem } from "./InvitationItem";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface EventInvitationsListProps {
  eventId: string;
  isOrganizer: boolean;
}

export function EventInvitationsList({ eventId, isOrganizer }: EventInvitationsListProps) {
  const { toast } = useToast();
  
  const { 
    data: invitations, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['event-invitations', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_invitations')
        .select(`
          id,
          event_id,
          status,
          created_at,
          email_sent,
          email_sent_at,
          last_viewed_at,
          expiration_date,
          invitee:profiles!event_invitations_invitee_id_fkey(
            id, 
            full_name, 
            avatar_url,
            email_notifications
          )
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: isOrganizer,
  });

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('event_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Invitation cancelled",
        description: "The invitation has been cancelled successfully.",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel invitation.",
        variant: "destructive",
      });
    }
  };

  if (!isOrganizer) return null;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load invitations. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Invitations</h3>
        <span className="text-sm text-muted-foreground">
          {invitations?.length || 0} invitation{invitations?.length !== 1 ? 's' : ''}
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ScrollArea className="h-[400px] rounded-md border">
          <div className="p-4 space-y-6">
            {invitations?.map((invitation) => (
              <InvitationItem
                key={invitation.id}
                invitation={invitation}
                onRemove={handleCancelInvitation}
              />
            ))}

            {!invitations?.length && (
              <p className="text-center text-muted-foreground py-8">
                No invitations sent yet
              </p>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}