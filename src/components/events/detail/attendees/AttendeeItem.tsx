import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AttendeeItemProps {
  attendee: {
    user: {
      id: string;
      full_name: string;
      avatar_url: string;
    };
    registration_type: string;
    waitlist_position: number | null;
  };
  onRemove: (userId: string) => void;
}

export function AttendeeItem({ attendee, onRemove }: AttendeeItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={attendee.user.avatar_url} />
          <AvatarFallback>
            {attendee.user.full_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span>{attendee.user.full_name}</span>
          {attendee.waitlist_position && (
            <span className="text-sm text-muted-foreground">
              Position: #{attendee.waitlist_position}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={attendee.registration_type === 'registered' ? 'default' : 'secondary'}>
          {attendee.registration_type === 'registered' ? 'Registered' : 'Waitlisted'}
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
              onClick={() => onRemove(attendee.user.id)}
            >
              <UserX className="h-4 w-4 mr-2" />
              Remove {attendee.registration_type === 'registered' ? 'Attendee' : 'from Waitlist'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}