import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { useState } from "react";
import { LoadingSkeleton } from "./list/LoadingSkeleton";
import { EventDateGroup } from "./list/EventDateGroup";
import { Event, categoryColors } from "./list/types";
import { EventFilters } from "./filters/EventFilters";

export function EventsList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "past" | "all">("upcoming");

  const { data: events, isLoading } = useQuery({
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

  // Filter events based on search, category, and time
  const filteredEvents = events.filter(event => {
    const matchesSearch = search === "" || 
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      (event.description?.toLowerCase().includes(search.toLowerCase()) ?? false);

    const matchesCategory = category === "all" || event.category === category;

    const now = new Date();
    const eventDate = parseISO(event.start_time);
    const matchesTimeFilter = timeFilter === "all" || 
      (timeFilter === "upcoming" && isAfter(eventDate, now)) ||
      (timeFilter === "past" && isBefore(eventDate, now));

    return matchesSearch && matchesCategory && matchesTimeFilter;
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
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
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
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
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