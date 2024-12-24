import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Event } from "@/components/events/list/types";
import type { EventCategory } from "@/components/events/detail/types";

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            organizer:profiles!events_organizer_id_fkey(
              full_name, 
              avatar_url
            )
          `)
          .or(`is_private.eq.false,organizer_id.eq.${user.id}`)
          .order('start_time', { ascending: true });

        if (error) {
          console.error("Error fetching events:", error);
          throw error;
        }

        // Ensure category is of type EventCategory
        return (data || []).map(event => ({
          ...event,
          category: (event.category || 'other') as EventCategory
        })) as Event[];
      } catch (error) {
        console.error("Error in useEvents:", error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useEventInvitations() {
  return useQuery({
    queryKey: ['event-invitations'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        console.log("Fetching invitations for user:", user.id);

        const { data, error } = await supabase
          .from('event_invitations')
          .select(`
            id,
            status,
            created_at,
            last_viewed_at,
            event:events(
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

        // Transform and ensure proper typing
        return (data || []).map(invitation => ({
          ...invitation.event,
          category: (invitation.event.category || 'other') as EventCategory,
          invitation_id: invitation.id,
          invitation_status: invitation.status,
          last_viewed_at: invitation.last_viewed_at,
          invitation_created_at: invitation.created_at
        })) as Event[];
      } catch (error) {
        console.error("Error in useEventInvitations:", error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}