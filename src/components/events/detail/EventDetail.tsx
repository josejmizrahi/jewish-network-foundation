import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { EditEventDialog } from "../EditEventDialog";
import { EventHeader } from "./EventHeader";
import { EventContent } from "./EventContent";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Event, EventCategory } from "../types";
import { EventBreadcrumb } from "./EventBreadcrumb";

export function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: eventData, isLoading } = useQuery({
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
      
      return {
        ...data,
        category: (data.category || 'other') as EventCategory,
        category_color: data.category_color || 'gray'
      } as Event;
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
    if (!eventData) return;
    
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: 'cancelled' })
        .eq('id', eventData.id);

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
        <Skeleton className="h-4 w-32" /> {/* Breadcrumb skeleton */}
        <Skeleton className="h-[200px] md:h-[400px] w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <Card className="p-4 md:p-6 max-w-4xl mx-auto">
        <p className="text-center text-muted-foreground">Event not found</p>
      </Card>
    );
  }

  const isOrganizer = user?.id === eventData.organizer_id;

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-8 px-0">
      <EventBreadcrumb eventTitle={eventData.title} />
      
      <EventHeader
        title={eventData.title}
        description={eventData.description}
        isPrivate={eventData.is_private}
        isOrganizer={isOrganizer}
        onEdit={() => setIsEditDialogOpen(true)}
        onCancel={handleCancelEvent}
        status={eventData.status}
        coverImage={eventData.cover_image}
      />

      <EventContent
        event={eventData}
        isOrganizer={isOrganizer}
        isRegistered={!!isRegistered}
        user={user}
      />

      {isOrganizer && (
        <EditEventDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          event={eventData}
        />
      )}
    </div>
  );
}