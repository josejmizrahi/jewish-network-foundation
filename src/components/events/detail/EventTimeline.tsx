import { format } from "date-fns";
import { MapPin, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SubEvent } from "./sub-events/types";
import { iconComponents } from "./sub-events/iconMapping";

interface EventTimelineProps {
  subEvents: SubEvent[];
}

export function EventTimeline({ subEvents }: EventTimelineProps) {
  if (!subEvents.length) return null;

  const getIconComponent = (iconName: string = 'Calendar') => {
    return iconComponents[iconName as keyof typeof iconComponents] || iconComponents.Calendar;
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-border" />
      
      {/* Timeline events */}
      <div className="space-y-8">
        {subEvents.map((subEvent, index) => {
          const IconComponent = getIconComponent(subEvent.icon);
          const delay = index * 0.1; // Stagger the animations

          return (
            <div 
              key={subEvent.id} 
              className="relative flex gap-4 opacity-0 animate-fade-in"
              style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
            >
              {/* Timeline dot with hover effect */}
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center relative z-10 transition-transform hover:scale-110 duration-200">
                <IconComponent className="w-5 h-5 text-primary" />
              </div>
              
              {/* Event content with hover effect */}
              <div className="flex-1 space-y-2 transition-all duration-200 hover:translate-x-1">
                <h3 className="font-medium">{subEvent.title}</h3>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(subEvent.start_time), "h:mm a")} - {format(new Date(subEvent.end_time), "h:mm a")}
                </div>
                
                {subEvent.description && (
                  <p className="text-sm text-muted-foreground">{subEvent.description}</p>
                )}
                
                {(subEvent.location || subEvent.is_online) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {subEvent.is_online ? (
                      <>
                        <Video className="w-4 h-4" />
                        <span>Online Event</span>
                      </>
                    ) : subEvent.location ? (
                      <>
                        <MapPin className="w-4 h-4" />
                        <span>{subEvent.location}</span>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}