import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { EventInvitation } from "@/types/notifications";
import { useNavigate } from "react-router-dom";

interface NotificationItemProps {
  notification: EventInvitation;
  onAccept: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

export function NotificationItem({ notification, onAccept, onReject }: NotificationItemProps) {
  const navigate = useNavigate();

  const formatDate = (date: string) => {
    return format(new Date(date), 'PPp');
  };

  return (
    <div className="flex flex-col items-start p-4 space-y-1 cursor-default border-b last:border-0">
      <div className="flex items-start justify-between w-full">
        <div className="flex-1">
          <p className="text-sm font-medium">
            Event Invitation: {notification.event.title}
          </p>
          <p className="text-xs text-muted-foreground">
            from {notification.event.organizer.full_name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(notification.created_at)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full mt-2">
        <Button
          size="sm"
          variant="default"
          className="flex-1"
          onClick={() => onAccept(notification.id)}
        >
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => onReject(notification.id)}
        >
          Decline
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate(`/events/${notification.event.id}`)}
        >
          View
        </Button>
      </div>
    </div>
  );
}