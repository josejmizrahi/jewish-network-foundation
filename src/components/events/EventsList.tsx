import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Video } from "lucide-react";
import { Link } from "react-router-dom";

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
  cover_image: string | null;
  status: string;
  is_private: boolean;
}

export function EventsList() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (!events?.length) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No events found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Link key={event.id} to={`/events/${event.id}`}>
          <Card className="p-6 hover:bg-muted/50 transition-colors">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  {event.is_private && (
                    <Badge variant="secondary">Private</Badge>
                  )}
                </div>
                {event.description && (
                  <p className="text-muted-foreground mt-1 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(event.start_time), "PPP")}
                  </span>
                </div>

                {event.is_online ? (
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <span>Online Event</span>
                  </div>
                ) : event.location ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                ) : null}

                {event.max_capacity && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.current_attendees} / {event.max_capacity} attendees
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}