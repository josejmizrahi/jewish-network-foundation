import { Event } from "./types";
import { EventInfo } from "./EventInfo";
import { EventOrganizer } from "./EventOrganizer";
import { EventRegistrationCard } from "./registration/EventRegistrationCard";
import { EventManagementTabs } from "./EventManagementTabs";
import { User } from "@supabase/supabase-js";

interface EventContentProps {
  event: Event;
  isOrganizer: boolean;
  isRegistered: boolean;
  user: User | null;
}

export function EventContent({ event, isOrganizer, isRegistered, user }: EventContentProps) {
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

        {event.organizer && (
          <EventOrganizer 
            organizerName={event.organizer.full_name}
            organizerAvatar={event.organizer.avatar_url}
          />
        )}

        {isOrganizer && (
          <EventManagementTabs eventId={event.id} isOrganizer={isOrganizer} />
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