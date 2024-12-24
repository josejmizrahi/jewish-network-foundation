import { Event } from "../types";
import { EmptyState } from "../EmptyState";
import { EventDateGroup } from "../EventDateGroup";
import { categoryColors } from "../types";
import { filterEvents, groupEventsByDate } from "../utils/eventGrouping";
import { memo } from "react";

interface FilteredEventsListProps {
  events: Event[];
  search: string;
  category: string;
  timeFilter: "upcoming" | "past" | "all";
  selectedTags: string[];
  hasFilters: boolean;
}

export const FilteredEventsList = memo(function FilteredEventsList({
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
    <div 
      className="mt-8 space-y-8" 
      style={{ 
        contentVisibility: 'auto',
        containIntrinsicSize: 'auto 500px'
      }}
    >
      {Object.entries(groupedEvents).map(([date, dateEvents]) => (
        <div 
          key={date}
          className="transform-gpu"
          style={{
            willChange: 'transform',
            contentVisibility: 'auto',
            containIntrinsicSize: '0 500px'
          }}
        >
          <EventDateGroup
            date={date}
            events={dateEvents}
            categoryColors={categoryColors}
          />
        </div>
      ))}
    </div>
  );
});