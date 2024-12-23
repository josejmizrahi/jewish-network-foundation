import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useEffect } from "react";
import { LoadingSkeleton } from "./list/LoadingSkeleton";
import { EventDateGroup } from "./list/EventDateGroup";
import { Event, categoryColors } from "./list/types";

export function EventsList() {
  const { data: events, isLoading, refetch } = useQuery({
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
      return data as Event[];
    },
  });

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!events?.length) {
    return (
      <div className="text-center py-12 bg-card rounded-xl">
        <p className="text-muted-foreground">No events found</p>
      </div>
    );
  }

  const groupEventsByDate = (events: Event[]) => {
    const groups: { [key: string]: Event[] } = {};
    events.forEach(event => {
      const date = format(new Date(event.start_time), 'MMM dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
    });
    return groups;
  };

  const groupedEvents = groupEventsByDate(events);

  return (
    <div className="space-y-8">
      {Object.entries(groupedEvents).map(([date, dateEvents]) => (
        <EventDateGroup
          key={date}
          date={date}
          events={dateEvents}
          categoryColors={categoryColors}
        />
      ))}
    </div>
  );
}