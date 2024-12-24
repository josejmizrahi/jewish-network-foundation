import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { EditEventDialog } from "./EditEventDialog";
import { EventHeader } from "./detail/EventHeader";
import { EventContent } from "./detail/EventContent";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Event } from "./detail/types";
import { EventBreadcrumb } from "./detail/EventBreadcrumb";
import { EventRegistrationCard } from "./detail/registration/EventRegistrationCard";
import { useIsMobile } from "@/hooks/use-mobile";

export function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isMobile = useIsMobile();

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
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Event not found');
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
      <div className="space-y-6 animate-fade-in will-change-transform">
        <Skeleton className="h-4 w-32" />
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
      <div className="p-4 text-center text-muted-foreground animate-fade-in will-change-transform">
        Event not found
      </div>
    );
  }

  const isOrganizer = user?.id === event.organizer_id;

  return (
    <div className="space-y-6 md:space-y-8">
      <EventBreadcrumb eventTitle={event.title} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
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

          <EventContent
            event={event}
            isOrganizer={isOrganizer}
            isRegistered={!!isRegistered}
            user={user}
          />
        </div>

        <div className={isMobile ? "" : "sticky-container"}>
          <div className="rounded-xl border bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 shadow-sm transition-all duration-300 hover:shadow-md">
            <EventRegistrationCard
              eventId={event.id}
              isRegistered={!!isRegistered}
              status={event.status}
              user={user}
              currentAttendees={event.current_attendees}
              maxCapacity={event.max_capacity}
              waitlistEnabled={event.waitlist_enabled}
              isPrivate={event.is_private}
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