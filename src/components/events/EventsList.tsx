import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { LoadingSkeleton } from "./list/LoadingSkeleton";
import { EventDateGroup } from "./list/EventDateGroup";
import { Event, categoryColors } from "./list/types";
import { EventFilters } from "./filters/EventFilters";
import { EmptyState } from "./list/EmptyState";
import { filterEvents, groupEventsByDate } from "./list/utils/eventGrouping";

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
    return <EmptyState hasFilters={false} />;
  }

  const filteredEvents = filterEvents(events, search, category, timeFilter);
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
        <EmptyState hasFilters={true} />
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