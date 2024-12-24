import { Event } from "../detail/types";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { InvitationActions } from "./InvitationActions";

interface InvitationCardProps {
  event: Event;
  invitationId: string;
  invitationStatus: string;
}

export function InvitationCard({ event, invitationId, invitationStatus }: InvitationCardProps) {
  return (
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
              <Link to={`/events/${event.id}`}>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
              </Link>
              {event.description && (
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                  {event.description}
                </p>
              )}
            </div>
            <InvitationActions 
              invitationId={invitationId}
              status={invitationStatus}
            />
          </div>
          
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(event.start_time), "PPp")}
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
  );
}