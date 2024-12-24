import { format } from "date-fns";
import { EventCard } from "./EventCard";
import { Event } from "./types";
import { memo } from "react";

interface EventDateGroupProps {
  date: string;
  events: Event[];
  categoryColors: Record<string, string>;
}

export const EventDateGroup = memo(function EventDateGroup({ 
  date, 
  events, 
  categoryColors 
}: EventDateGroupProps) {
  return (
    <div 
      className="space-y-4"
      style={{ contentVisibility: 'auto' }}
    >
      <div 
        className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 z-10 translate-z-0"
        style={{ willChange: 'transform' }}
      >
        <h2 className="text-lg font-semibold text-foreground">
          {date}
          <span className="text-muted-foreground ml-2 font-normal">
            {format(new Date(events[0].start_time), 'EEEE')}
          </span>
        </h2>
      </div>
      <div 
        className="space-y-4"
        style={{ 
          contentVisibility: 'auto',
          containIntrinsicSize: 'auto 200px'
        }}
      >
        {events.map((event) => (
          <div 
            key={event.id} 
            className="transform-gpu"
            style={{ willChange: 'transform' }}
          >
            <EventCard 
              event={event} 
              categoryColors={categoryColors} 
            />
          </div>
        ))}
      </div>
    </div>
  );
});