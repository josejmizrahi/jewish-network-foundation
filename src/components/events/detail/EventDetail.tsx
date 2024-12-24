import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { EditEventDialog } from "@/components/events/EditEventDialog";
import { EventHeader } from "@/components/events/detail/EventHeader";
import { EventContent } from "@/components/events/detail/EventContent";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Event } from "@/components/events/detail/types";
import { EventBreadcrumb } from "@/components/events/detail/EventBreadcrumb";

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
      <Card className="p-4 md:p-6 max-w-4xl mx-auto">
        <Skeleton className="h-4 w-32" /> {/* Breadcrumb skeleton */}
        <Skeleton className="h-[200px] md:h-[400px] w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Card>
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
      <EventBreadcrumb eventTitle={event.title} />
      
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
        isRegistered={false}
        user={user}
      />

      {isOrganizer && (
        <EditEventDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          event={event}
        />
      )}
      
      {event.luma_id && (
        <div 
          className="w-full h-[600px] border rounded-lg overflow-hidden"
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://lu.ma/embed-checkout/${event.luma_id}" width="100%" height="100%" frameborder="0" style="border: 0; background: transparent;"></iframe>`
          }}
        />
      )}
    </div>
  );
}