import { useState } from "react";
import { LoadingSkeleton } from "./list/LoadingSkeleton";
import { EmptyState } from "./list/EmptyState";
import { EventTabs } from "./list/EventTabs";
import { EventContent } from "./list/EventContent";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";

export function EventsList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "past" | "all">("upcoming");
  const [showMyEvents, setShowMyEvents] = useState(false);
  const { user } = useAuth();

  const { 
    data: events = [], 
    isLoading: eventsLoading, 
    error: eventsError 
  } = useEvents();

  if (eventsLoading) {
    return <LoadingSkeleton />;
  }

  if (eventsError) {
    console.error("Events error:", eventsError);
    return (
      <div className="text-center py-12 bg-card rounded-xl">
        <p className="text-destructive">Error loading events. Please try again later.</p>
      </div>
    );
  }

  // Filter out events based on my events filter
  const currentEvents = showMyEvents && user
    ? events.filter(event => event.organizer_id === user.id)
    : events;

  return (
    <div className="space-y-8 content-visibility-auto">
      <EventTabs
        activeTab="all"
        onTabChange={() => {}}
        invitationsCount={0}
      >
        <EventContent
          events={currentEvents}
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          showFilters={true}
          activeTab="all"
          showMyEvents={showMyEvents}
          onMyEventsChange={setShowMyEvents}
        />
      </EventTabs>
    </div>
  );
}