import { useState } from "react";
import { LoadingSkeleton } from "./list/LoadingSkeleton";
import { EmptyState } from "./list/EmptyState";
import { EventTabs } from "./list/EventTabs";
import { EventContent } from "./list/EventContent";
import { useEvents, useEventInvitations } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";

export function EventsList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "past" | "all">("upcoming");
  const [activeTab, setActiveTab] = useState<"all" | "invitations">("all");
  const [showMyEvents, setShowMyEvents] = useState(false);
  const { user } = useAuth();

  const { 
    data: events = [], 
    isLoading: eventsLoading, 
    error: eventsError 
  } = useEvents();

  const { 
    data: invitations = [], 
    isLoading: invitationsLoading, 
    error: invitationsError 
  } = useEventInvitations();

  if (eventsLoading || invitationsLoading) {
    return <LoadingSkeleton />;
  }

  if (eventsError || invitationsError) {
    console.error("Events error:", eventsError);
    console.error("Invitations error:", invitationsError);
    return (
      <div className="text-center py-12 bg-card rounded-xl">
        <p className="text-destructive">Error loading events. Please try again later.</p>
      </div>
    );
  }

  // Filter out events based on the active tab and my events filter
  const currentEvents = activeTab === "all" 
    ? showMyEvents && user
      ? events.filter(event => 
          event.organizer_id === user.id || 
          event.attendees?.some(attendee => attendee.user_id === user.id)
        )
      : events
    : invitations;

  return (
    <div className="space-y-8">
      <EventTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        invitationsCount={invitations.filter(inv => inv.invitation_status === 'pending').length}
      >
        <EventContent
          events={currentEvents}
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          showFilters={activeTab === "all"}
          activeTab={activeTab}
          showMyEvents={showMyEvents}
          onMyEventsChange={setShowMyEvents}
        />
      </EventTabs>
    </div>
  );
}