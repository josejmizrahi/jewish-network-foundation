import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface EventOrganizerProps {
  organizerName: string;
  organizerAvatar?: string;
}

export function EventOrganizer({ organizerName, organizerAvatar }: EventOrganizerProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={organizerAvatar} />
          <AvatarFallback>{organizerName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">Organized by</p>
          <p className="text-lg font-semibold">{organizerName}</p>
        </div>
      </div>
    </Card>
  );
}