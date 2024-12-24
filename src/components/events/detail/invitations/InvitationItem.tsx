import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format, isValid, parseISO } from "date-fns";
import { Clock, Mail, MoreHorizontal, UserX } from "lucide-react";

interface InvitationItemProps {
  invitation: {
    id: string;
    event_id: string;
    invitee: {
      full_name: string;
      avatar_url: string;
      email_notifications: boolean;
    };
    status: string;
    created_at: string;
  };
  onRemove: (invitationId: string) => void;
}

export function InvitationItem({ invitation, onRemove }: InvitationItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500/20 text-green-500';
      case 'rejected':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-yellow-500/20 text-yellow-500';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return 'Invalid date';
      }
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="flex items-center justify-between group hover:bg-accent/50 p-2 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={invitation.invitee.avatar_url} />
          <AvatarFallback>
            {invitation.invitee.full_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{invitation.invitee.full_name}</span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              Sent {formatDate(invitation.created_at)}
            </span>
            {invitation.invitee.email_notifications && (
              <Tooltip>
                <TooltipTrigger>
                  <Mail className="h-3 w-3" />
                </TooltipTrigger>
                <TooltipContent>
                  Email notifications enabled
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={getStatusColor(invitation.status)}>
          {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => onRemove(invitation.id)}
            >
              <UserX className="h-4 w-4 mr-2" />
              Cancel Invitation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}