import { useState } from "react";
import { LoadingSkeleton } from "./list/LoadingSkeleton";
import { EmptyState } from "./list/EmptyState";
import { EventTabs } from "./list/EventTabs";
import { EventContent } from "./list/EventContent";
import { useEvents, useEventInvitations } from "@/hooks/useEvents";

export function EventsList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "past" | "all">("upcoming");
  const [activeTab, setActiveTab] = useState<"all" | "invitations">("all");

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

  // Filter out events based on the active tab
  const currentEvents = activeTab === "all" ? events : invitations;

  return (
    <div className="space-y-8">
      <EventTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        invitationsCount={invitations.length}
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
          activeTab={activeTab}
        />
      </EventTabs>
    </div>
  );
}