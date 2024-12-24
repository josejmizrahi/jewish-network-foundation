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

      // First, let's check if the user exists in the invitations table
      const { count, error: countError } = await supabase
        .from('event_invitations')
        .select('*', { count: 'exact', head: true })
        .eq('invitee_id', user.id);

      console.log("Total invitations found for user:", count);

      if (countError) {
        console.error("Error checking invitations:", countError);
        throw countError;
      }

      const { data: invitationData, error } = await supabase
        .from('event_invitations')
        .select(`
          id,
          status,
          created_at,
          last_viewed_at,
          email_sent,
          email_sent_at,
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
            organizer_id,
            status,
            is_private,
            category,
            category_color,
            waitlist_enabled,
            tags,
            organizer:profiles!events_organizer_id_fkey(
              full_name,
              avatar_url
            )
          )
        `)
        .eq('invitee_id', user.id);

      if (error) {
        console.error("Error fetching invitations:", error);
        throw error;
      }

      console.log("Raw invitation data:", invitationData);

      // Map the nested event data to match the Event type
      const processedInvitations = (invitationData || []).map(inv => ({
        ...inv.event,
        invitation_id: inv.id,
        invitation_status: inv.status
      }));

      console.log("Processed invitations:", processedInvitations);
      return processedInvitations as Event[];
    },
  });
}