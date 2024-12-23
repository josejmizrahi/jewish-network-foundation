import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Video, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

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
  category: string;
  category_color: string;
  organizer: {
    full_name: string;
    avatar_url: string;
  } | null;
}

const categoryColors: Record<string, string> = {
  workshop: "bg-blue-500/20 text-blue-500",
  meetup: "bg-green-500/20 text-green-500",
  conference: "bg-purple-500/20 text-purple-500",
  social: "bg-orange-500/20 text-orange-500",
  other: "bg-gray-500/20 text-gray-500",
};

export function EventsList() {
  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          organizer:profiles!events_organizer_id_fkey(full_name, avatar_url)
        `)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
  });

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-xl mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!events?.length) {
    return (
      <div className="text-center py-12 bg-card rounded-xl">
        <p className="text-muted-foreground">No events found</p>
      </div>
    );
  }

  const groupEventsByDate = (events: Event[]) => {
    const groups: { [key: string]: Event[] } = {};
    events.forEach(event => {
      const date = format(new Date(event.start_time), 'MMM dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
    });
    return groups;
  };

  const groupedEvents = groupEventsByDate(events);

  return (
    <div className="space-y-8">
      {Object.entries(groupedEvents).map(([date, dateEvents]) => (
        <div key={date} className="space-y-4">
          <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 z-10">
            <h2 className="text-lg font-semibold text-foreground">
              {date}
              <span className="text-muted-foreground ml-2 font-normal">
                {format(new Date(dateEvents[0].start_time), 'EEEE')}
              </span>
            </h2>
          </div>
          <div className="space-y-4">
            {dateEvents.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`}>
                <div className="group relative bg-card hover:bg-accent transition-colors rounded-xl p-4">
                  <div className="flex gap-4">
                    {event.cover_image ? (
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={event.cover_image}
                          alt={event.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {event.title}
                          </h3>
                          {event.description && (
                            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {event.status === 'published' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                              Live
                            </span>
                          )}
                          <Badge 
                            variant="secondary"
                            className={`${categoryColors[event.category] || categoryColors.other}`}
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {event.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(event.start_time), "h:mm a")}
                          </span>
                        </div>
                        {event.is_online ? (
                          <div className="flex items-center gap-1.5">
                            <Video className="h-4 w-4" />
                            <span>Online Event</span>
                          </div>
                        ) : event.location ? (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        ) : null}
                        {event.max_capacity && (
                          <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4" />
                            <span>
                              {event.current_attendees} / {event.max_capacity}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}