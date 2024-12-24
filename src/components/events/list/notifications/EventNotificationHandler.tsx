import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface EventNotificationHandlerProps {
  handleViewInvitation: (invitationId: string) => void;
}

export function EventNotificationHandler({ handleViewInvitation }: EventNotificationHandlerProps) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('invitation-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'event_invitations',
          filter: `invitee_id=eq.${user.id}`,
        },
        async (payload: any) => {
          const { data: event } = await supabase
            .from('events')
            .select('title, organizer:profiles!events_organizer_id_fkey(full_name)')
            .eq('id', payload.new.event_id)
            .single();

          if (!event) return;

          toast(`New Event Invitation: ${event.title}`, {
            description: `${event.organizer.full_name} has invited you to an event`,
            action: {
              label: "View",
              onClick: () => handleViewInvitation(payload.new.id),
            },
            duration: 10000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, handleViewInvitation]);

  return null;
}