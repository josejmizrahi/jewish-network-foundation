import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { EventLocationMap } from "./EventLocationMap";

interface EventInfoProps {
  startTime: string;
  endTime: string;
  isOnline: boolean;
  meetingUrl: string | null;
  location: string | null;
  showMap?: boolean;
  showDetails?: boolean;
}

export function EventInfo({
  startTime,
  endTime,
  isOnline,
  meetingUrl,
  location,
  showMap = true,
  showDetails = true,
}: EventInfoProps) {
  if (showMap && !showDetails) {
    return location ? <EventLocationMap location={location} /> : null;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{format(new Date(startTime), "EEEE, MMMM d, yyyy")}</p>
              <p className="text-sm text-muted-foreground">Date</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {format(new Date(startTime), "h:mm a")} - {format(new Date(endTime), "h:mm a")}
              </p>
              <p className="text-sm text-muted-foreground">Time</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {isOnline ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Online Event</p>
                {meetingUrl && (
                  <Button
                    variant="link"
                    className="h-auto p-0 text-primary"
                    asChild
                  >
                    <a
                      href={meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join Meeting
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ) : location ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{location}</p>
                <p className="text-sm text-muted-foreground">Location</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {showMap && location && !isOnline && (
        <div className="mt-6">
          <EventLocationMap location={location} />
        </div>
      )}
    </div>
  );
}