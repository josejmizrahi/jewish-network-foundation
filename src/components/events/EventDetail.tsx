import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { EditEventDialog } from "./EditEventDialog";
import { EventHeader } from "./detail/EventHeader";
import { EventInfo } from "./detail/EventInfo";
import { EventOrganizer } from "./detail/EventOrganizer";
import { EventAttendees } from "./detail/EventAttendees";
import { EventRegistration } from "./detail/EventRegistration";
import { useState } from "react";

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  is_online: boolean;
  meeting_url: string | null;
  max_capacity: number | null;
  current_attendees: number;
  status: string;
  is_private: boolean;
  timezone: string;
  organizer_id: string;
  organizer: {
    full_name: string;
    avatar_url: string;
  } | null;
}

export function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          organizer:profiles(full_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Event;
    },
  });

  const { data: isRegistered } = useQuery({
    queryKey: ['event-registration', id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from('event_attendees')
        .select('*')
        .eq('event_id', id)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-muted rounded w-1/4"></div>
      </Card>
    );
  }

  if (!event) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">Event not found</p>
      </Card>
    );
  }

  const isOrganizer = user?.id === event.organizer_id;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <EventHeader
          title={event.title}
          description={event.description}
          isPrivate={event.is_private}
          isOrganizer={isOrganizer}
          onEdit={() => setIsEditDialogOpen(true)}
          status={event.status}
        />

        <EventInfo
          startTime={event.start_time}
          endTime={event.end_time}
          isOnline={event.is_online}
          meetingUrl={event.meeting_url}
          location={event.location}
          maxCapacity={event.max_capacity}
          currentAttendees={event.current_attendees}
          isRegistered={!!isRegistered}
        />

        {event.organizer && (
          <EventOrganizer organizerName={event.organizer.full_name} />
        )}

        {isOrganizer && (
          <EventAttendees eventId={event.id} isOrganizer={isOrganizer} />
        )}

        <EventRegistration
          eventId={event.id}
          isRegistered={!!isRegistered}
          status={event.status}
          user={user}
        />
      </div>

      {isOrganizer && (
        <EditEventDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          event={event}
        />
      )}
    </Card>
  );
}