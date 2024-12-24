import { Calendar, MapPin, Users, Video, Tag, BadgeCheck, BadgeAlert, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Event } from "./types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { memo } from "react";

interface EventCardProps {
  event: Event;
  categoryColors: Record<string, string>;
}

export const EventCard = memo(function EventCard({ event, categoryColors }: EventCardProps) {
  const { toast } = useToast();

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: `Join me at ${event.title}`,
      text: `I'd like to invite you to this event: ${event.title}${event.description ? ` - ${event.description}` : ''}`,
      url: `${window.location.origin}/events/${event.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link copied",
          description: "Event link has been copied to clipboard",
        });
      }
    } catch (error) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link copied",
          description: "Event link has been copied to clipboard",
        });
      } catch (clipboardError) {
        toast({
          title: "Error",
          description: "Failed to share or copy event link",
          variant: "destructive",
        });
      }
    }
  };

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
    <Link to={`/events/${event.id}`} className="block transform-gpu">
      <div className="group relative bg-card hover:bg-accent transition-colors rounded-xl p-4 will-change-transform">
        <div className="flex flex-col sm:flex-row gap-4">
          {event.cover_image ? (
            <div className="w-full sm:w-48 h-32 sm:h-48 flex-shrink-0">
              <img
                src={event.cover_image}
                alt={event.title}
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : (
            <div className="w-full sm:w-48 h-32 sm:h-48 bg-muted rounded-lg flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge()}
                  <Badge 
                    variant="secondary"
                    className={`${categoryColors[event.category] || categoryColors.other}`}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {event.category}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full self-end sm:self-start"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
                  <span className="truncate">{event.location}</span>
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
});