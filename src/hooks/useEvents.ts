import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Event } from "@/components/events/list/types";
import type { EventCategory } from "@/components/events/detail/types";

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('events')
        .select(`
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
          organizer:profiles!events_organizer_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .order('start_time', { ascending: true })
        .limit(50); // Limit initial load to 50 events

      if (error) {
        console.error("Error fetching events:", error);
        throw error;
      }

      return (data || []).map(event => ({
        ...event,
        category: (event.category || 'other') as EventCategory
      })) as Event[];
    },
    staleTime: 1000 * 60 * 2, // Data stays fresh for 2 minutes
    gcTime: 1000 * 60 * 5, // Keep unused data in cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data is fresh
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
          created_at,
          last_viewed_at,
          event:events (
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
            organizer:profiles!events_organizer_id_fkey (
              full_name,
              avatar_url
            )
          )
        `)
        .eq('invitee_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20); // Limit initial load to 20 invitations

      if (error) {
        console.error("Error fetching invitations:", error);
        throw error;
      }

      return (data || [])
        .filter(invitation => invitation.event) // Filter out any invitations with null events
        .map(invitation => ({
          ...invitation.event,
          category: (invitation.event.category || 'other') as EventCategory,
          invitation_id: invitation.id,
          invitation_status: invitation.status,
          invitation_created_at: invitation.created_at,
          last_viewed_at: invitation.last_viewed_at
        })) as Event[];
    },
    staleTime: 1000 * 60 * 2, // Data stays fresh for 2 minutes
    gcTime: 1000 * 60 * 5, // Keep unused data in cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data is fresh
  });
}