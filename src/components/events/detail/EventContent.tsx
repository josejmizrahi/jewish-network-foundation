import { Event } from "./types";
import { EventInfo } from "./EventInfo";
import { EventOrganizer } from "./EventOrganizer";
import { User } from "@supabase/supabase-js";
import { useIsMobile } from "@/hooks/use-mobile";
import { Calendar, MapPin, Users } from "lucide-react";

interface EventContentProps {
  event: Event;
  isOrganizer: boolean;
  user: User | null;
}

export function EventContent({ event, isOrganizer, user }: EventContentProps) {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-8">
      {/* Event Info */}
      <div className="rounded-xl border bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Event Details</h2>
        </div>
        <EventInfo
          startTime={event.start_time}
          endTime={event.end_time}
          isOnline={event.is_online}
          meetingUrl={event.meeting_url}
          location={event.location}
          showMap={false}
        />
      </div>

      {/* Organizer */}
      {event.organizer && (
        <div className="rounded-xl border bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Event Organizer</h2>
          </div>
          <EventOrganizer 
            organizerName={event.organizer.full_name}
            organizerAvatar={event.organizer.avatar_url}
          />
        </div>
      )}

      {/* Map Section */}
      {!event.is_online && event.location && (
        <div className="rounded-xl border bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Location</h2>
          </div>
          <EventInfo
            startTime={event.start_time}
            endTime={event.end_time}
            isOnline={event.is_online}
            meetingUrl={event.meeting_url}
            location={event.location}
            showMap={true}
            showDetails={false}
          />
        </div>
      )}
    </div>
  );
}