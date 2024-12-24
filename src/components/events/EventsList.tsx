import { useState } from "react";
import { LoadingSkeleton } from "./list/LoadingSkeleton";
import { EmptyState } from "./list/EmptyState";
import { EventTabs } from "./list/EventTabs";
import { EventContent } from "./list/EventContent";
import { useEventsList, useEventInvitations } from "@/hooks/useEventQueries";
import { useAuth } from "@/hooks/useAuth";
import { Event, EventCategory } from "./types";

export function EventsList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "past" | "all">("upcoming");
  const [activeTab, setActiveTab] = useState<"all" | "invitations">("all");
  const [showMyEvents, setShowMyEvents] = useState(false);
  const { user } = useAuth();

  const { 
    data: eventsData = [], 
    isLoading: eventsLoading, 
    error: eventsError 
  } = useEventsList();

  const { 
    data: invitationsData = [], 
    isLoading: invitationsLoading, 
    error: invitationsError 
  } = useEventInvitations();

  // Type assertion to ensure category is of type EventCategory
  const events = eventsData.map(event => ({
    ...event,
    category: (event.category || 'other') as EventCategory,
    category_color: event.category_color || 'gray'
  })) as Event[];

  // Map invitations to Event type with proper type checking and defaults
  const invitations = invitationsData.map(invitation => {
    // Ensure we have an event object, even if empty
    const eventData = invitation.event || {};
    // Ensure we have an organizer object, even if empty
    const organizerData = eventData.organizer || {};

    const defaultEvent: Event = {
      id: eventData.id || invitation.event_id || '',
      title: eventData.title || '',
      description: eventData.description || null,
      start_time: eventData.start_time || new Date().toISOString(),
      end_time: eventData.end_time || new Date().toISOString(),
      timezone: eventData.timezone || 'UTC',
      location: eventData.location || null,
      is_online: Boolean(eventData.is_online),
      meeting_url: eventData.meeting_url || null,
      max_capacity: eventData.max_capacity || null,
      current_attendees: eventData.current_attendees || 0,
      status: eventData.status || 'draft',
      is_private: Boolean(eventData.is_private),
      cover_image: eventData.cover_image || null,
      organizer_id: eventData.organizer_id || '',
      category: (eventData.category || 'other') as EventCategory,
      category_color: eventData.category_color || 'gray',
      tags: Array.isArray(eventData.tags) ? eventData.tags : [],
      waitlist_enabled: Boolean(eventData.waitlist_enabled),
      invitation_id: invitation.id,
      invitation_status: invitation.status,
      organizer: {
        full_name: organizerData.full_name || '',
        avatar_url: organizerData.avatar_url || null
      }
    };

    return defaultEvent;
  });

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