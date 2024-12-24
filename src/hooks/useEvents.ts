import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Event } from "@/components/events/list/types";

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          organizer:profiles!events_organizer_id_fkey(full_name, avatar_url)
        `)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return (data || []) as Event[];
    },
  });
}

export function useEventInvitations() {
  return useQuery({
    queryKey: ['event-invitations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      console.log("Fetching invitations for user:", user.id);

      const { data: invitationData, error } = await supabase
        .from('event_invitations')
        .select(`
          id,
          status,
          event:events(
            *,
            organizer:profiles!events_organizer_id_fkey(full_name, avatar_url)
          )
        `)
        .eq('invitee_id', user.id)
        .eq('status', 'pending');

      if (error) {
        console.error("Error fetching invitations:", error);
        throw error;
      }

      console.log("Raw invitation data:", invitationData);

      // Filter out any null events and map to the expected Event type
      const processedInvitations = (invitationData || [])
        .filter(inv => inv.event)
        .map(inv => ({
          ...inv.event,
          invitation_id: inv.id,
          invitation_status: inv.status
        }));

      console.log("Processed invitations:", processedInvitations);
      return processedInvitations as Event[];
    },
  });
}