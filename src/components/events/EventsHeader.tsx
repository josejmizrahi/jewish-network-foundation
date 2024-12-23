import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EventsHeaderProps {
  onCreateEvent: () => void;
}

export function EventsHeader({ onCreateEvent }: EventsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground">Events</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Browse and join upcoming community events
        </p>
      </div>
      <Button 
        onClick={onCreateEvent}
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-full sm:w-auto"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Event
      </Button>
    </div>
  );
}