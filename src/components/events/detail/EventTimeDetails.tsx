import { format } from "date-fns";
import { Calendar, Clock, Globe2 } from "lucide-react";

interface EventTimeDetailsProps {
  startTime: string;
  endTime: string;
  timezone: string;
}

export function EventTimeDetails({ startTime, endTime, timezone }: EventTimeDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 text-slate-300">
        <Calendar className="h-5 w-5" />
        <div>
          <div>Start: {format(new Date(startTime), "EEE, MMM d")}</div>
          <div>End: {format(new Date(endTime), "EEE, MMM d")}</div>
        </div>
      </div>

      <div className="flex items-center space-x-4 text-slate-300">
        <Clock className="h-5 w-5" />
        <div>
          <div>{format(new Date(startTime), "hh:mm a")}</div>
          <div>{format(new Date(endTime), "hh:mm a")}</div>
        </div>
      </div>

      <div className="flex items-center space-x-4 text-slate-300">
        <Globe2 className="h-5 w-5" />
        <div>{timezone}</div>
      </div>
    </div>
  );
}