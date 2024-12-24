import { Calendar, MapPin, Users, Video, Tag, BadgeCheck, BadgeAlert } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Event } from "./types";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  categoryColors: Record<string, string>;
}

export function EventCard({ event, categoryColors }: EventCardProps) {
  const getStatusBadge = () => {
    switch (event.status) {
      case 'published':
        return (
          <Badge variant="default" className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
            <BadgeCheck className="w-3 h-3 mr-1" />
            Live
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive" className="rounded-full">
            <BadgeAlert className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const getCapacityIndicator = () => {
    if (!event.max_capacity) return null;

    const capacityPercentage = (event.current_attendees / event.max_capacity) * 100;
    const isAlmostFull = capacityPercentage >= 80;
    const isFull = capacityPercentage >= 100;

    return (
      <div className="mt-2 space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{event.current_attendees} / {event.max_capacity} spots filled</span>
          {isAlmostFull && !isFull && (
            <span className="text-warning">Almost Full</span>
          )}
          {isFull && (
            <span className="text-destructive">Full</span>
          )}
        </div>
        <Progress 
          value={capacityPercentage} 
          className={cn(
            "h-1",
            isAlmostFull && !isFull && "bg-warning/20",
            isFull && "bg-destructive/20"
          )}
        />
      </div>
    );
  };

  return (
    <Link to={`/events/${event.id}`}>
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
                {getStatusBadge()}
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
            {getCapacityIndicator()}
          </div>
        </div>
      </div>
    </Link>
  );
}