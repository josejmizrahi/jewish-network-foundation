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

interface EventContentProps {
  event: Event;
  isOrganizer: boolean;
  isRegistered: boolean;
  user: User | null;
}

export function EventContent({ event, isOrganizer, isRegistered, user }: EventContentProps) {
  const { data: subEvents = [] } = useQuery({
    queryKey: ['sub-events', event.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sub_events')
        .select('*')
        .eq('event_id', event.id)
        .order('start_time', { ascending: true });

      if (error) throw error;
      
      // Convert database icon string to SubEventIcon type
      return data.map(event => ({
        ...event,
        icon: (event.icon?.charAt(0).toUpperCase() + event.icon?.slice(1)) as SubEventIcon
      }));
    },
  });

  return (
    <div className="grid gap-4 md:gap-8 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4 md:space-y-8">
        <EventInfo
          startTime={event.start_time}
          endTime={event.end_time}
          isOnline={event.is_online}
          meetingUrl={event.meeting_url}
          location={event.location}
          maxCapacity={event.max_capacity}
          currentAttendees={event.current_attendees}
          isRegistered={isRegistered}
        />

        {subEvents.length > 0 && (
          <EventTimeline subEvents={subEvents} />
        )}

        {event.organizer && (
          <EventOrganizer 
            organizerName={event.organizer.full_name}
            organizerAvatar={event.organizer.avatar_url}
          />
        )}

        {isOrganizer && (
          <EventManagementTabs 
            eventId={event.id} 
            isOrganizer={isOrganizer}
            eventStartTime={new Date(event.start_time)}
            eventEndTime={new Date(event.end_time)}
          />
        )}
      </div>

      <div className="order-first md:order-none">
        <div className="md:sticky md:top-6">
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
      </div>
    </div>
  );
}