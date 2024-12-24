import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserX } from "lucide-react";

interface InvitationItemProps {
  invitation: {
    id: string;
    event_id: string;
    invitee: {
      full_name: string;
      avatar_url: string;
    };
    status: string;
  };
  onRemove: (invitationId: string) => void;
}

export function InvitationItem({ invitation, onRemove }: InvitationItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={invitation.invitee.avatar_url} />
          <AvatarFallback>
            {invitation.invitee.full_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span>{invitation.invitee.full_name}</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={
          invitation.status === 'accepted' ? 'default' :
          invitation.status === 'rejected' ? 'destructive' :
          'secondary'
        }>
          {invitation.status}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
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