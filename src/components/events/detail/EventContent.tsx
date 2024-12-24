import { Event } from "./types";
import { EventInfo } from "./EventInfo";
import { EventOrganizer } from "./EventOrganizer";
import { EventManagementTabs } from "./EventManagementTabs";
import { EventTimeline } from "./EventTimeline";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SubEventIcon } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Calendar, MapPin, Users } from "lucide-react";

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
          maxCapacity={event.max_capacity}
          currentAttendees={event.current_attendees}
          isRegistered={isRegistered}
          showMap={false}
        />
      </div>

      {/* Timeline */}
      {subEvents.length > 0 && (
        <div className="rounded-xl border bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Event Timeline</h2>
          </div>
          <EventTimeline subEvents={subEvents} />
        </div>
      )}

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

      {/* Management Tabs */}
      {isOrganizer && (
        <div className="rounded-xl border bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 p-6 shadow-sm">
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
            maxCapacity={event.max_capacity}
            currentAttendees={event.current_attendees}
            isRegistered={isRegistered}
            showMap={true}
            showDetails={false}
          />
        </div>
      )}
    </div>
  );
}