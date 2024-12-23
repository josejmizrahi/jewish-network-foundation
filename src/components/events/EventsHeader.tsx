import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EventsHeaderProps {
  onCreateEvent: () => void;
}

export function EventsHeader({ onCreateEvent }: EventsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-white">Events</h1>
        <p className="text-gray-400 mt-1">
          Browse and join upcoming community events
        </p>
      </div>
      <Button 
        onClick={onCreateEvent}
        className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white rounded-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Event
      </Button>
    </div>
  );
}