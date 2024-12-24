import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MoreHorizontal, UserX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InvitationsListProps {
  eventId: string;
  isOrganizer: boolean;
}

interface Invitation {
  id: string;
  event_id: string;
  invitee: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  status: string;
  created_at: string;
}

export function InvitationsList({ eventId, isOrganizer }: InvitationsListProps) {
  const { toast } = useToast();
  const { data: invitations, isLoading } = useQuery({
    queryKey: ['event-invitations', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_invitations')
        .select(`
          id,
          event_id,
          status,
          created_at,
          invitee:profiles!event_invitations_invitee_id_fkey(id, full_name, avatar_url)
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Invitation[];
    },
    enabled: isOrganizer,
  });

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('event_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Invitation cancelled",
        description: "The invitation has been cancelled.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel invitation.",
        variant: "destructive",
      });
    }
  };

  if (!isOrganizer) return null;

  if (isLoading) {
    return <div className="animate-pulse space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-12 bg-muted rounded" />
      ))}
    </div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Invitations</h3>
      </div>
      <ScrollArea className="h-[400px] rounded-md border">
        <div className="p-4 space-y-6">
          {invitations?.map((invitation) => (
            <div key={invitation.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={invitation.invitee.avatar_url} />
                  <AvatarFallback>
                    {invitation.invitee.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span>{invitation.invitee.full_name}</span>
                </div>
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
                      onClick={() => handleCancelInvitation(invitation.id)}
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Cancel Invitation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          {!invitations?.length && (
            <p className="text-center text-muted-foreground">No invitations sent yet</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}