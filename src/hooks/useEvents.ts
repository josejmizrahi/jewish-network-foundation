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

      const { data, error } = await supabase
        .from('event_invitations')
        .select(`
          id,
          status,
          event:events!inner(
            id,
            title,
            description,
            start_time,
            end_time,
            timezone,
            location,
            is_online,
            meeting_url,
            max_capacity,
            current_attendees,
            cover_image,
            status,
            is_private,
            category,
            category_color,
            tags,
            organizer_id,
            waitlist_enabled,
            organizer:profiles!events_organizer_id_fkey(
              full_name,
              avatar_url
            )
          )
        `)
        .eq('invitee_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching invitations:", error);
        throw error;
      }

      // Transform the data to match the Event type with invitation details
      return data.map(invitation => ({
        ...invitation.event,
        invitation_id: invitation.id,
        invitation_status: invitation.status
      })) as Event[];
    },
  });
}