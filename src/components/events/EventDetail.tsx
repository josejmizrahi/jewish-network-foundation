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
import { useIsMobile } from "@/hooks/use-mobile";
import { EventMetaTags } from "./detail/EventMetaTags";

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
  const eventUrl = `${window.location.origin}/events/${event.id}`;

  return (
    <div className="space-y-6 md:space-y-8">
      <EventMetaTags
        title={event.title}
        description={event.description}
        coverImage={event.cover_image}
        url={eventUrl}
      />
      
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
            eventId={event.id}
            isShareable={event.is_shareable}
          />

          <EventContent
            event={event}
            isOrganizer={isOrganizer}
            user={user}
          />
        </div>

        <div className={isMobile ? "" : "sticky-container"}>
          {event.luma_id && (
            <div className="w-full h-[600px] border rounded-lg overflow-hidden">
              <iframe 
                src={`https://lu.ma/embed-checkout/${event.luma_id}`}
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, background: 'transparent' }}
              />
            </div>
          )}
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