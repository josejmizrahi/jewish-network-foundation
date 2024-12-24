import { format } from "date-fns";
import { MapPin, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Music, Users, Utensils, Book, Presentation } from "lucide-react";
import { SubEventIcon } from "./sub-events/SubEventIconSelect";

interface SubEvent {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  is_online: boolean;
  meeting_url: string | null;
  icon?: SubEventIcon;
}

interface EventTimelineProps {
  subEvents: SubEvent[];
}

const iconComponents = {
  Calendar,
  Clock,
  Video,
  MapPin,
  Music,
  Users,
  Utensils,
  Book,
  Presentation,
};

export function EventTimeline({ subEvents }: EventTimelineProps) {
  if (!subEvents.length) return null;

  const getIconComponent = (iconName: SubEventIcon = 'Calendar') => {
    return iconComponents[iconName] || Calendar;
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Event Timeline</h2>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-border" />
        
        {/* Timeline events */}
        <div className="space-y-8">
          {subEvents.map((subEvent) => {
            const IconComponent = getIconComponent(subEvent.icon);

            return (
              <div key={subEvent.id} className="relative flex gap-4">
                {/* Timeline dot */}
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center relative z-10">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
                
                {/* Event content */}
                <div className="flex-1 space-y-2">
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
    </Card>
  );
}