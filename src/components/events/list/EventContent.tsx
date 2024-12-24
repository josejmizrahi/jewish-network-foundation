import { Event } from "../detail/types";
import { EventFilters } from "../filters/EventFilters";
import { FilteredEventsList } from "./filtered/FilteredEventsList";
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
  activeTab: "all";
  showMyEvents: boolean;
  onMyEventsChange: (value: boolean) => void;
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
  showMyEvents,
  onMyEventsChange,
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
          showMyEvents={showMyEvents}
          onMyEventsChange={onMyEventsChange}
        />
      )}

      <FilteredEventsList
        events={events}
        search={search}
        category={category}
        timeFilter={timeFilter}
        selectedTags={selectedTags}
        hasFilters={hasFilters}
      />
    </div>
  );
}