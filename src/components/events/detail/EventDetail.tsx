import { useParams } from "react-router-dom";
import { useEventDetail } from "@/hooks/useEventQueries";
import { EventContent } from "./EventContent";
import { LoadingSkeleton } from "../list/LoadingSkeleton";

export function EventDetail() {
  const { id } = useParams();
  const { data: event, isLoading, error } = useEventDetail(id);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error loading event details</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p>Event not found</p>
      </div>
    );
  }

  return <EventContent event={event} />;
}