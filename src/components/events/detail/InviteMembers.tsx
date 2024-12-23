import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, CheckCircle, XCircle, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InviteMembersProps {
  eventId: string;
  isOrganizer: boolean;
}

export function InviteMembers({ eventId, isOrganizer }: InviteMembersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const { data: invitations } = useQuery({
    queryKey: ['event-invitations', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_invitations')
        .select(`
          id,
          status,
          invitee:profiles!event_invitations_invitee_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;
      return data;
    },
  });

  const { data: members } = useQuery({
    queryKey: ['profiles', search],
    queryFn: async () => {
      const query = supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .neq('id', (await supabase.auth.getUser()).data.user?.id || '')
        .order('full_name');

      if (search) {
        query.ilike('full_name', `%${search}%`);
      }

      const { data, error } = await query.limit(10);
      if (error) throw error;
      return data;
    },
  });

  const handleInvite = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('event_invitations')
        .insert({
          event_id: eventId,
          inviter_id: (await supabase.auth.getUser()).data.user?.id,
          invitee_id: userId,
        });

      if (error) throw error;

      toast({
        title: "Invitation sent",
        description: "The member has been invited to the event.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation.",
        variant: "destructive",
      });
    }
  };

  if (!isOrganizer) return null;

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="w-full"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Invite Members
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Invite Members</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                {invitations?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Invited Members</h3>
                    {invitations.map((invitation) => (
                      <div key={invitation.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={invitation.invitee.avatar_url || ""} />
                            <AvatarFallback>
                              {invitation.invitee.full_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span>{invitation.invitee.full_name}</span>
                        </div>
                        <Badge variant={
                          invitation.status === 'accepted' ? 'default' :
                          invitation.status === 'rejected' ? 'destructive' :
                          'secondary'
                        }>
                          {invitation.status === 'accepted' && <CheckCircle className="h-4 w-4 mr-1" />}
                          {invitation.status === 'rejected' && <XCircle className="h-4 w-4 mr-1" />}
                          {invitation.status === 'pending' && <Mail className="h-4 w-4 mr-1" />}
                          {invitation.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="font-medium">Members</h3>
                  {members?.map((member) => {
                    const isInvited = invitations?.some(
                      (inv) => inv.invitee.id === member.id
                    );

                    return (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.avatar_url || ""} />
                            <AvatarFallback>{member.full_name?.[0]}</AvatarFallback>
                          </Avatar>
                          <span>{member.full_name}</span>
                        </div>
                        {!isInvited && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleInvite(member.id)}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Invite
                          </Button>
                        )}
                      </div>
                    )}
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}