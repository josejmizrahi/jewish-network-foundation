import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EventsHeaderProps {
  onCreateEvent: () => void;
}

export function EventsHeader({ onCreateEvent }: EventsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <p className="text-muted-foreground">
          Create and manage community events
        </p>
      </div>
      <Button onClick={onCreateEvent}>
        <Plus className="mr-2 h-4 w-4" />
        Create Event
      </Button>
    </div>
  );
}