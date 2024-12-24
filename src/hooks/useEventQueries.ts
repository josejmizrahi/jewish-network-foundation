import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useEventsList() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          organizer:profiles(id, full_name, avatar_url),
          attendees:event_attendees(user_id, status)
        `)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useEventInvitations() {
  return useQuery({
    queryKey: ['event-invitations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_invitations')
        .select(`
          *,
          event:events(*),
          inviter:profiles!event_invitations_inviter_id_fkey(full_name, avatar_url)
        `)
        .eq('status', 'pending');

      if (error) throw error;
      return data || [];
    },
  });
}

export function useEventDetail(eventId: string | undefined) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) return null;

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          organizer:profiles(id, full_name, avatar_url),
          attendees:event_attendees(
            user_id,
            status,
            user:profiles(id, full_name, avatar_url)
          )
        `)
        .eq('id', eventId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });
}