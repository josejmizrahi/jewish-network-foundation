import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Event } from "@/components/events/detail/types";
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
          cover_image,
          status,
          is_private,
          category,
          category_color,
          tags,
          organizer_id,
          is_shareable,
          luma_id,
          organizer:profiles!events_organizer_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .order('start_time', { ascending: true })
        .limit(50);

      if (error) {
        console.error("Error fetching events:", error);
        throw error;
      }

      return (data || []).map(event => ({
        ...event,
        category: (event.category || 'other') as EventCategory
      })) as Event[];
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}