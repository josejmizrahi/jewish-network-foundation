import { Event } from "./types";
import { EventDateGroup } from "./EventDateGroup";
import { EmptyState } from "./EmptyState";
import { filterEvents, groupEventsByDate } from "./utils/eventGrouping";
import { categoryColors } from "./types";
import { EventFilters } from "../filters/EventFilters";
import { useState, useEffect } from "react";

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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    // Extract unique tags from all events
    const tags = new Set<string>();
    events.forEach(event => {
      event.tags?.forEach(tag => tags.add(tag));
    });
    setAvailableTags(Array.from(tags));
  }, [events]);

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredEvents = filterEvents(events, search, category, timeFilter, selectedTags);
  const groupedEvents = groupEventsByDate(filteredEvents);
  const hasFilters = search !== "" || category !== "all" || timeFilter !== "all" || selectedTags.length > 0;

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
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
          availableTags={availableTags}
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