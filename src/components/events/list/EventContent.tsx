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
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

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

  const handleInvitationResponse = async (invitationId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('event_invitations')
        .update({ status })
        .eq('id', invitationId);

      if (error) throw error;

      toast.success(`Invitation ${status} successfully`);
    } catch (error: any) {
      toast.error(`Failed to ${status} invitation: ${error.message}`);
    }
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
        <div className="mt-8 space-y-6">
          {events.map((event) => (
            <div key={event.id} className="bg-card hover:bg-accent transition-colors rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  {event.description && (
                    <p className="text-muted-foreground mt-1">{event.description}</p>
                  )}
                </div>
                {event.invitation_id && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-500 hover:text-green-600"
                      onClick={() => handleInvitationResponse(event.invitation_id!, 'accepted')}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive/90"
                      onClick={() => handleInvitationResponse(event.invitation_id!, 'rejected')}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}