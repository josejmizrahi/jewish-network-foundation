import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InvitationItem } from "./InvitationItem";

interface EventInvitationsListProps {
  eventId: string;
  isOrganizer: boolean;
}

export function EventInvitationsList({ eventId, isOrganizer }: EventInvitationsListProps) {
  const { toast } = useToast();
  const { data: invitations, isLoading } = useQuery({
    queryKey: ['event-invitations', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_invitations')
        .select(`
          id,
          event_id,
          status,
          created_at,
          invitee:profiles!event_invitations_invitee_id_fkey(id, full_name, avatar_url)
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

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
        description: "The invitation has been cancelled.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel invitation.",
        variant: "destructive",
      });
    }
  };

  if (!isOrganizer) return null;

  if (isLoading) {
    return <div className="animate-pulse space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-12 bg-muted rounded" />
      ))}
    </div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Invitations</h3>
      </div>
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
            <p className="text-center text-muted-foreground">No invitations sent yet</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}