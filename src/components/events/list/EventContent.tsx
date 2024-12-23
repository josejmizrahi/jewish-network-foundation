import { Event } from "./types";
import { EventDateGroup } from "./EventDateGroup";
import { EmptyState } from "./EmptyState";
import { filterEvents, groupEventsByDate } from "./utils/eventGrouping";
import { categoryColors } from "./types";
import { EventFilters } from "../filters/EventFilters";

interface EventContentProps {
  events: Event[];
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  timeFilter: "upcoming" | "past" | "all";
  onTimeFilterChange: (value: "upcoming" | "past" | "all") => void;
  showFilters?: boolean;
}

export function EventContent({
  events,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  timeFilter,
  onTimeFilterChange,
  showFilters = true,
}: EventContentProps) {
  const filteredEvents = filterEvents(events, search, category, timeFilter);
  const groupedEvents = groupEventsByDate(filteredEvents);
  const hasFilters = search !== "" || category !== "all" || timeFilter !== "all";

  return (
    <div className="mt-6">
      {showFilters && (
        <EventFilters
          search={search}
          onSearchChange={onSearchChange}
          category={category}
          onCategoryChange={onCategoryChange}
          timeFilter={timeFilter}
          onTimeFilterChange={onTimeFilterChange}
        />
      )}
      {Object.keys(groupedEvents).length === 0 ? (
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
      ) : (
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
      )}
    </div>
  );
}