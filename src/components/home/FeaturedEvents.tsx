import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";

export function FeaturedEvents() {
  const { data: upcomingEvents } = useQuery({
    queryKey: ['homepage-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          title,
          start_time,
          location,
          is_online,
          category,
          current_attendees,
          max_capacity,
          organizer:profiles!events_organizer_id_fkey (
            full_name
          )
        `)
        .eq('status', 'published')
        .eq('is_private', false)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(3);

      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <Calendar className="h-12 w-12 text-primary" />
        <h3 className="text-xl font-semibold">Community Events</h3>
        <div className="space-y-4">
          {upcomingEvents?.map(event => (
            <div key={event.id} className="border-t pt-4 first:border-t-0 first:pt-0">
              <h4 className="font-medium">{event.title}</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(event.start_time), 'MMM d, h:mm a')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                {event.is_online ? (
                  <>
                    <MapPin className="h-4 w-4" />
                    <span>Online Event</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    <span>{event.location || 'Location TBA'}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button variant="ghost" className="w-full" asChild>
          <Link to="/events" className="flex items-center justify-center gap-2">
            View All Events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}