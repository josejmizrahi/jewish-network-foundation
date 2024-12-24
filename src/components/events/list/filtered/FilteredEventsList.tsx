import { Event } from "../types";
import { EmptyState } from "../EmptyState";
import { EventDateGroup } from "../EventDateGroup";
import { categoryColors } from "../types";
import { filterEvents, groupEventsByDate } from "../utils/eventGrouping";

interface FilteredEventsListProps {
  events: Event[];
  search: string;
  category: string;
  timeFilter: "upcoming" | "past" | "all";
  selectedTags: string[];
  hasFilters: boolean;
}

export function FilteredEventsList({
  events,
  search,
  category,
  timeFilter,
  selectedTags,
  hasFilters,
}: FilteredEventsListProps) {
  const filteredEvents = filterEvents(events, search, category, timeFilter, selectedTags);
  const groupedEvents = groupEventsByDate(filteredEvents);

  if (Object.keys(groupedEvents).length === 0) {
    return (
      <div className="mt-8">
        <EmptyState 
          hasFilters={hasFilters} 
          message={
            events.length === 0 
              ? "No events found. Events you create or get invited to will appear here."
              : "No events match your filters"
          }
        />
      </div>
    );
  }

  return (
    <div className="mt-8">
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