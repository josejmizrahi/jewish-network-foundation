import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AttendeeItem } from "./AttendeeItem";
import { Button } from "@/components/ui/button";

interface EventAttendeesListProps {
  eventId: string;
  isOrganizer: boolean;
}

export function EventAttendeesList({ eventId, isOrganizer }: EventAttendeesListProps) {
  const { toast } = useToast();
  const { data: attendees, isLoading } = useQuery({
    queryKey: ['event-attendees', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_attendees')
        .select(`
          event_id,
          user_id,
          status,
          registration_type,
          waitlist_position,
          created_at,
          user:profiles(id, full_name, avatar_url)
        `)
        .eq('event_id', eventId)
        .order('registration_type', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: isOrganizer,
  });

  const handleRemoveAttendee = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('event_attendees')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Attendee removed",
        description: "The attendee has been removed from the event.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove attendee.",
        variant: "destructive",
      });
    }
  };

  if (!isOrganizer) return null;

  if (isLoading) {
    return <div className="animate-pulse space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-12 bg-muted rounded" />
      ))}
    </div>;
  }

  const registeredAttendees = attendees?.filter(a => a.registration_type === 'registered') || [];
  const waitlistAttendees = attendees?.filter(a => a.registration_type === 'waitlist') || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Attendees</h3>
        <Button variant="outline" size="sm" onClick={() => {
          toast({
            title: "Coming soon",
            description: "Export functionality will be available soon.",
          });
        }}>
          Export List
        </Button>
      </div>
      <ScrollArea className="h-[400px] rounded-md border">
        <div className="p-4 space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Registered ({registeredAttendees.length})</h4>
            {registeredAttendees.map((attendee) => (
              <AttendeeItem
                key={`${attendee.event_id}-${attendee.user_id}`}
                attendee={attendee}
                onRemove={handleRemoveAttendee}
              />
            ))}
          </div>

          {waitlistAttendees.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Waitlist ({waitlistAttendees.length})</h4>
              {waitlistAttendees.map((attendee) => (
                <AttendeeItem
                  key={`${attendee.event_id}-${attendee.user_id}`}
                  attendee={attendee}
                  onRemove={handleRemoveAttendee}
                />
              ))}
            </div>
          )}

          {!attendees?.length && (
            <p className="text-center text-muted-foreground">No attendees yet</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}