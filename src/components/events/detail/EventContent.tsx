import { Event } from "./types";
import { EventInfo } from "./EventInfo";
import { EventOrganizer } from "./EventOrganizer";
import { EventRegistrationCard } from "./registration/EventRegistrationCard";
import { EventManagementTabs } from "./EventManagementTabs";
import { EventTimeline } from "./EventTimeline";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SubEventIcon } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";

interface EventContentProps {
  event: Event;
  isOrganizer: boolean;
  isRegistered: boolean;
  user: User | null;
}

export function EventContent({ event, isOrganizer, isRegistered, user }: EventContentProps) {
  const isMobile = useIsMobile();
  
  const { data: subEvents = [] } = useQuery({
    queryKey: ['sub-events', event.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sub_events')
        .select('*')
        .eq('event_id', event.id)
        .order('start_time', { ascending: true });

      if (error) throw error;
      
      return data.map(event => ({
        ...event,
        icon: (event.icon?.charAt(0).toUpperCase() + event.icon?.slice(1)) as SubEventIcon
      }));
    },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Event Info */}
        <div className="bg-card rounded-lg border p-6">
          <EventInfo
            startTime={event.start_time}
            endTime={event.end_time}
            isOnline={event.is_online}
            meetingUrl={event.meeting_url}
            location={event.location}
            maxCapacity={event.max_capacity}
            currentAttendees={event.current_attendees}
            isRegistered={isRegistered}
            showMap={false}
          />
        </div>

        {/* Registration Card */}
        <div className={isMobile ? "" : "sticky top-6"}>
          <EventRegistrationCard
            eventId={event.id}
            isRegistered={isRegistered}
            status={event.status}
            user={user}
            currentAttendees={event.current_attendees}
            maxCapacity={event.max_capacity}
            waitlistEnabled={event.waitlist_enabled}
          />
        </div>

        {/* Timeline */}
        {subEvents.length > 0 && (
          <div className="bg-card rounded-lg border p-6">
            <EventTimeline subEvents={subEvents} />
          </div>
        )}

        {/* Organizer */}
        {event.organizer && (
          <div className="bg-card rounded-lg border p-6">
            <EventOrganizer 
              organizerName={event.organizer.full_name}
              organizerAvatar={event.organizer.avatar_url}
            />
          </div>
        )}

        {/* Management Tabs */}
        {isOrganizer && (
          <div className="bg-card rounded-lg border p-6">
            <EventManagementTabs 
              eventId={event.id} 
              isOrganizer={isOrganizer}
              eventStartTime={new Date(event.start_time)}
              eventEndTime={new Date(event.end_time)}
            />
          </div>
        )}

        {/* Map Section */}
        {!event.is_online && event.location && (
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Location</h2>
            <EventInfo
              startTime={event.start_time}
              endTime={event.end_time}
              isOnline={event.is_online}
              meetingUrl={event.meeting_url}
              location={event.location}
              maxCapacity={event.max_capacity}
              currentAttendees={event.current_attendees}
              isRegistered={isRegistered}
              showMap={true}
              showDetails={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}