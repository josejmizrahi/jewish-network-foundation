import { Event } from "./types";
import { EventFilters } from "../filters/EventFilters";
import { FilteredEventsList } from "./filtered/FilteredEventsList";
import { InvitationsList } from "./invitations/InvitationsList";
import { EventNotificationHandler } from "./notifications/EventNotificationHandler";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface EventContentProps {
  events: Event[];
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  timeFilter: "upcoming" | "past" | "all";
  onTimeFilterChange: (value: "upcoming" | "past" | "all") => void;
  showFilters?: boolean;
  activeTab: "all" | "invitations";
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
  activeTab,
  showMyEvents,
  onMyEventsChange,
}: EventContentProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    console.log("Current events in EventContent:", events);
    console.log("Active tab:", activeTab);
  }, [events, activeTab]);

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

  const handleViewInvitation = async (invitationId: string) => {
    await supabase
      .from('event_invitations')
      .update({ last_viewed_at: new Date().toISOString() })
      .eq('id', invitationId);

    window.location.href = '/events?tab=invitations';
  };

  const hasFilters = search !== "" || category !== "all" || timeFilter !== "all" || selectedTags.length > 0;

  return (
    <div className="mt-6">
      <EventNotificationHandler handleViewInvitation={handleViewInvitation} />

      {showFilters && activeTab === "all" && (
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

      {activeTab === "invitations" ? (
        <InvitationsList events={events} />
      ) : (
        <FilteredEventsList
          events={events}
          search={search}
          category={category}
          timeFilter={timeFilter}
          selectedTags={selectedTags}
          hasFilters={hasFilters}
        />
      )}
    </div>
  );
}