import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { EditEventDialog } from "./EditEventDialog";
import { EventHeader } from "./detail/EventHeader";
import { EventInfo } from "./detail/EventInfo";
import { EventOrganizer } from "./detail/EventOrganizer";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  const handleRegister = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register for events.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('event_attendees')
        .insert({
          event_id: id,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Registration successful",
        description: "You have been registered for this event.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['event-registration', id] });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register for the event.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEvent = async () => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Event cancelled",
        description: "The event has been cancelled successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['events', id] });
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
          onCancel={handleCancelEvent}
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

        <div className="flex justify-end">
          <Button
            onClick={handleRegister}
            disabled={isRegistered || !user || event.status === 'cancelled'}
          >
            {event.status === 'cancelled' 
              ? "Event Cancelled" 
              : isRegistered 
                ? "Already Registered" 
                : "Register for Event"}
          </Button>
        </div>
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