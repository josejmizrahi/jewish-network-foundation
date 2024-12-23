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
}

export function EventContent({
  events,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  timeFilter,
  onTimeFilterChange,
}: EventContentProps) {
  const filteredEvents = filterEvents(events, search, category, timeFilter);
  const groupedEvents = groupEventsByDate(filteredEvents);

  return (
    <div className="mt-6">
      <EventFilters
        search={search}
        onSearchChange={onSearchChange}
        category={category}
        onCategoryChange={onCategoryChange}
        timeFilter={timeFilter}
        onTimeFilterChange={onTimeFilterChange}
      />
      {Object.keys(groupedEvents).length === 0 ? (
        <EmptyState hasFilters={true} />
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