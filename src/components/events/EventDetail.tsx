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
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { InviteMembers } from "./detail/InviteMembers";

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
  cover_image: string | null;
  waitlist_enabled: boolean;
  organizer: {
    full_name: string;
    avatar_url: string;
  } | null;
}

export function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          organizer:profiles!events_organizer_id_fkey(full_name, avatar_url)
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
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
  });

  const handleCancelEvent = async () => {
    if (!event) return;
    
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: 'cancelled' })
        .eq('id', event.id);

      if (error) throw error;

      toast({
        title: "Event cancelled",
        description: "The event has been cancelled successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel the event.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-[200px] md:h-[400px] w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <Card className="p-4 md:p-6 max-w-4xl mx-auto">
        <p className="text-center text-muted-foreground">Event not found</p>
      </Card>
    );
  }

  const isOrganizer = user?.id === event.organizer_id;

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-8 px-0">
      <EventHeader
        title={event.title}
        description={event.description}
        isPrivate={event.is_private}
        isOrganizer={isOrganizer}
        onEdit={() => setIsEditDialogOpen(true)}
        onCancel={handleCancelEvent}
        status={event.status}
        coverImage={event.cover_image}
      />

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
            isRegistered={!!isRegistered}
          />

          {event.organizer && (
            <EventOrganizer 
              organizerName={event.organizer.full_name}
              organizerAvatar={event.organizer.avatar_url}
            />
          )}

          {isOrganizer && (
            <>
              <InviteMembers eventId={event.id} isOrganizer={isOrganizer} />
              <EventAttendees eventId={event.id} isOrganizer={isOrganizer} />
            </>
          )}
        </div>

        <div className="order-first md:order-none">
          <div className="md:sticky md:top-6">
            <EventRegistration
              eventId={event.id}
              isRegistered={!!isRegistered}
              status={event.status}
              user={user}
              currentAttendees={event.current_attendees}
              maxCapacity={event.max_capacity}
              waitlistEnabled={event.waitlist_enabled}
            />
          </div>
        </div>
      </div>

      {isOrganizer && (
        <EditEventDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          event={event}
        />
      )}
    </div>
  );
}
