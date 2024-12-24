import { Event } from "./types";
import { EventDateGroup } from "./EventDateGroup";
import { EmptyState } from "./EmptyState";
import { filterEvents, groupEventsByDate } from "./utils/eventGrouping";
import { categoryColors } from "./types";
import { EventFilters } from "../filters/EventFilters";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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
  const { user } = useAuth();

  useEffect(() => {
    // Extract unique tags from all events
    const tags = new Set<string>();
    events.forEach(event => {
      event.tags?.forEach(tag => tags.add(tag));
    });
    setAvailableTags(Array.from(tags));
  }, [events]);

  useEffect(() => {
    if (!user) return;

    // Subscribe to invitation updates
    const channel = supabase
      .channel('invitation-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'event_invitations',
          filter: `invitee_id=eq.${user.id}`,
        },
        (payload: any) => {
          handleNewInvitation(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleNewInvitation = async (invitation: any) => {
    // Fetch event details
    const { data: event } = await supabase
      .from('events')
      .select('title, organizer:profiles!events_organizer_id_fkey(full_name)')
      .eq('id', invitation.event_id)
      .single();

    if (!event) return;

    // Show interactive toast notification
    toast(`New Event Invitation: ${event.title}`, {
      description: `${event.organizer.full_name} has invited you to an event`,
      action: {
        label: "View",
        onClick: () => handleViewInvitation(invitation.id),
      },
      duration: 10000,
    });
  };

  const handleViewInvitation = async (invitationId: string) => {
    // Update last_viewed_at timestamp
    await supabase
      .from('event_invitations')
      .update({ last_viewed_at: new Date().toISOString() })
      .eq('id', invitationId);

    // Navigate to events tab with invitations filter
    window.location.href = '/events?tab=invitations';
  };

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