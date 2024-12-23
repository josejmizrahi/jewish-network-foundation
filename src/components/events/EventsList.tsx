import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { LoadingSkeleton } from "./list/LoadingSkeleton";
import { EventDateGroup } from "./list/EventDateGroup";
import { Event, categoryColors } from "./list/types";
import { EventFilters } from "./filters/EventFilters";

export function EventsList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

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

  // Filter events based on search, category, and date range
  const filteredEvents = events.filter(event => {
    const matchesSearch = search === "" || 
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      (event.description?.toLowerCase().includes(search.toLowerCase()) ?? false);

    const matchesCategory = category === "all" || event.category === category;

    const eventDate = parseISO(event.start_time);
    const matchesStartDate = !startDate || isAfter(eventDate, startDate);
    const matchesEndDate = !endDate || isBefore(eventDate, endDate);

    return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
  });

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

  const groupedEvents = groupEventsByDate(filteredEvents);

  if (Object.keys(groupedEvents).length === 0) {
    return (
      <div className="space-y-8">
        <EventFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
        />
        <div className="text-center py-12 bg-card rounded-xl">
          <p className="text-muted-foreground">No events match your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <EventFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
      />
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