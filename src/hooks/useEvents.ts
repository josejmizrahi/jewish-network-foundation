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

      const { data: invitationData, error } = await supabase
        .from('event_invitations')
        .select(`
          event:events(
            *,
            organizer:profiles!events_organizer_id_fkey(full_name, avatar_url)
          )
        `)
        .eq('invitee_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;
      return (invitationData?.map(inv => inv.event).filter(Boolean) || []) as Event[];
    },
  });
}