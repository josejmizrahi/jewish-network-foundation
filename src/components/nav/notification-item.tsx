import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { EventInvitation } from "@/types/notifications";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface NotificationItemProps {
  notification: EventInvitation;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const formatDate = (date: string) => {
    return format(new Date(date), 'PPp');
  };

  const handleInvitationResponse = async (status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('event_invitations')
        .update({ 
          status,
          last_viewed_at: new Date().toISOString()
        })
        .eq('id', notification.id);

      if (error) throw error;

      toast({
        title: `Invitation ${status}`,
        description: `You have ${status} the event invitation.`,
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['event-invitations'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update invitation status.",
        variant: "destructive",
      });
    }
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
          onClick={() => handleInvitationResponse('accepted')}
        >
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => handleInvitationResponse('rejected')}
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