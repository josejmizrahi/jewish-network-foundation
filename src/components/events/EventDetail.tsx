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
import { format } from "date-fns";
import { MapPin, Calendar, Clock, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

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
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
          <div className="h-8 bg-slate-800 rounded w-1/3"></div>
          <div className="h-4 bg-slate-800 rounded w-1/2"></div>
          <div className="h-4 bg-slate-800 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-400">Event not found</p>
        </div>
      </div>
    );
  }

  const isOrganizer = user?.id === event.organizer_id;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-slate-800 rounded-full px-4 py-2 text-sm">
              Personal Calendar
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isOrganizer && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(true)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Edit Event
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelEvent}
                >
                  Cancel Event
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Event Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-800">
            <img 
              src="/lovable-uploads/f9d4f097-2caa-4377-bbfc-63b31b2d6a42.png"
              alt="Event cover"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Column - Event Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{event.title}</h1>

            {/* Date and Time */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-slate-300">
                <Calendar className="h-5 w-5" />
                <div>
                  <div>Start: {format(new Date(event.start_time), "EEE, MMM d")}</div>
                  <div>End: {format(new Date(event.end_time), "EEE, MMM d")}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-slate-300">
                <Clock className="h-5 w-5" />
                <div>
                  <div>{format(new Date(event.start_time), "hh:mm a")}</div>
                  <div>{format(new Date(event.end_time), "hh:mm a")}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-slate-300">
                <Globe2 className="h-5 w-5" />
                <div>{event.timezone}</div>
              </div>

              {event.location && (
                <div className="flex items-center space-x-4 text-slate-300">
                  <MapPin className="h-5 w-5" />
                  <div>{event.location}</div>
                </div>
              )}
            </div>

            {/* Event Options */}
            <div className="space-y-4 pt-6 border-t border-slate-800">
              <h3 className="text-lg font-semibold mb-4">Event Options</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <div className="font-medium">Tickets</div>
                    <div className="text-sm text-slate-400">Free</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <div className="font-medium">Require Approval</div>
                    <div className="text-sm text-slate-400">Manually approve attendees</div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <div className="font-medium">Capacity</div>
                    <div className="text-sm text-slate-400">
                      {event.max_capacity ? `${event.current_attendees}/${event.max_capacity}` : 'Unlimited'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Button */}
            <div className="pt-6">
              <EventRegistration
                eventId={event.id}
                isRegistered={!!isRegistered}
                status={event.status}
                user={user}
              />
            </div>
          </div>
        </div>

        {/* Description Section */}
        {event.description && (
          <div className="mt-12 p-6 bg-slate-800/50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="text-slate-300 whitespace-pre-wrap">{event.description}</p>
          </div>
        )}

        {/* Attendees Section */}
        {isOrganizer && (
          <div className="mt-8">
            <EventAttendees eventId={event.id} isOrganizer={isOrganizer} />
          </div>
        )}
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