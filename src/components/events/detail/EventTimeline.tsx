import { format } from "date-fns";
import { MapPin, Video } from "lucide-react";
import { SubEvent } from "./types";
import { iconComponents } from "./sub-events/iconMapping";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface EventTimelineProps {
  subEvents: SubEvent[];
}

export function EventTimeline({ subEvents }: EventTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  if (!subEvents.length) return null;

  const getIconComponent = (iconName: string = 'Calendar') => {
    return iconComponents[iconName as keyof typeof iconComponents] || iconComponents.Calendar;
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-primary/50 to-primary/20" />
      
      {/* Timeline events */}
      <div className="space-y-8">
        {subEvents.map((subEvent, index) => {
          const IconComponent = getIconComponent(subEvent.icon);
          const isExpanded = expandedId === subEvent.id;
          const delay = index * 0.1;

          return (
            <div 
              key={subEvent.id} 
              className="relative flex gap-4 opacity-0 animate-fade-in group"
              style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
            >
              {/* Timeline dot with hover effect */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-10 h-10 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center relative z-10",
                  "transition-all duration-300 hover:scale-110 hover:border-primary",
                  "group-hover:border-primary",
                  isExpanded && "border-primary scale-110"
                )}
                onClick={() => setExpandedId(isExpanded ? null : subEvent.id)}
              >
                <IconComponent className={cn(
                  "w-5 h-5 text-primary/60",
                  "transition-all duration-300",
                  "group-hover:text-primary",
                  isExpanded && "text-primary"
                )} />
              </Button>
              
              {/* Event content with hover effect */}
              <div 
                className={cn(
                  "flex-1 space-y-2 rounded-lg border border-transparent p-4",
                  "transition-all duration-300",
                  "hover:border-border hover:bg-accent/5 hover:translate-x-1",
                  isExpanded && "border-border bg-accent/5 translate-x-1"
                )}
                onClick={() => setExpandedId(isExpanded ? null : subEvent.id)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{subEvent.title}</h3>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(subEvent.start_time), "h:mm a")} - {format(new Date(subEvent.end_time), "h:mm a")}
                  </div>
                </div>
                
                {(isExpanded || subEvent.description) && (
                  <p className={cn(
                    "text-sm text-muted-foreground",
                    "transition-all duration-300",
                    !isExpanded && "line-clamp-2"
                  )}>
                    {subEvent.description}
                  </p>
                )}
                
                {(subEvent.location || subEvent.is_online) && (
                  <div className={cn(
                    "flex items-center gap-2 text-sm text-muted-foreground",
                    "transition-opacity duration-300",
                    !isExpanded && "opacity-70"
                  )}>
                    {subEvent.is_online ? (
                      <>
                        <Video className="w-4 h-4" />
                        <span>Online Event</span>
                        {isExpanded && subEvent.meeting_url && (
                          <a 
                            href={subEvent.meeting_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline ml-2"
                          >
                            Join Meeting
                          </a>
                        )}
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