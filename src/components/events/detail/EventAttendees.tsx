import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface EventAttendeesProps {
  eventId: string;
  isOrganizer: boolean;
}

interface Attendee {
  user: {
    full_name: string;
    avatar_url: string;
  };
  status: string;
  created_at: string;
}

export function EventAttendees({ eventId, isOrganizer }: EventAttendeesProps) {
  const { data: attendees, isLoading } = useQuery({
    queryKey: ['event-attendees', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_attendees')
        .select(`
          status,
          created_at,
          user:profiles(full_name, avatar_url)
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Attendee[];
    },
    enabled: isOrganizer, // Only fetch if user is the organizer
  });

  if (!isOrganizer) return null;

  if (isLoading) {
    return <div className="animate-pulse space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-12 bg-muted rounded" />
      ))}
    </div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Attendees</h3>
      <ScrollArea className="h-[200px] rounded-md border">
        <div className="p-4 space-y-4">
          {attendees?.map((attendee, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <div className="h-full w-full bg-muted" />
                </Avatar>
                <span>{attendee.user.full_name}</span>
              </div>
              <Badge variant={attendee.status === 'registered' ? 'default' : 'secondary'}>
                {attendee.status}
              </Badge>
            </div>
          ))}
          {!attendees?.length && (
            <p className="text-center text-muted-foreground">No attendees yet</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}