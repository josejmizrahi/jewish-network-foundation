import { Calendar, Clock, MapPin, Users, Video } from "lucide-react";
import { format } from "date-fns";

interface EventInfoProps {
  startTime: string;
  endTime: string;
  isOnline: boolean;
  meetingUrl: string | null;
  location: string | null;
  maxCapacity: number | null;
  currentAttendees: number;
  isRegistered: boolean;
}

export function EventInfo({
  startTime,
  endTime,
  isOnline,
  meetingUrl,
  location,
  maxCapacity,
  currentAttendees,
  isRegistered,
}: EventInfoProps) {
  return (
    <div className="grid gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <span>{format(new Date(startTime), "PPP")}</span>
      </div>

      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span>
          {format(new Date(startTime), "p")} - {format(new Date(endTime), "p")}
        </span>
      </div>

      {isOnline ? (
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4" />
          <span>Online Event</span>
          {meetingUrl && isRegistered && (
            <a 
              href={meetingUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Join Meeting
            </a>
          )}
        </div>
      ) : location ? (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
      ) : null}

      {maxCapacity && (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>
            {currentAttendees} / {maxCapacity} attendees
          </span>
        </div>
      )}
    </div>
  );
}