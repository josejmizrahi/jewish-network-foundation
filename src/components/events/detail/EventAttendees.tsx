import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MoreHorizontal, UserX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EventAttendeesProps {
  eventId: string;
  isOrganizer: boolean;
}

interface Attendee {
  user_id: string;
  event_id: string;
  user: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  status: string;
  registration_type: string;
  waitlist_position: number | null;
  created_at: string;
}

export function EventAttendees({ eventId, isOrganizer }: EventAttendeesProps) {
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
      return data as Attendee[];
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
              <div key={`${attendee.event_id}-${attendee.user_id}`} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={attendee.user.avatar_url} />
                    <AvatarFallback>
                      {attendee.user.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{attendee.user.full_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">
                    Registered
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleRemoveAttendee(attendee.user_id)}
                      >
                        <UserX className="h-4 w-4 mr-2" />
                        Remove Attendee
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {waitlistAttendees.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Waitlist ({waitlistAttendees.length})</h4>
              {waitlistAttendees.map((attendee) => (
                <div key={`${attendee.event_id}-${attendee.user_id}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={attendee.user.avatar_url} />
                      <AvatarFallback>
                        {attendee.user.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span>{attendee.user.full_name}</span>
                      <span className="text-sm text-muted-foreground">
                        Position: #{attendee.waitlist_position}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      Waitlisted
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleRemoveAttendee(attendee.user_id)}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Remove from Waitlist
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
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