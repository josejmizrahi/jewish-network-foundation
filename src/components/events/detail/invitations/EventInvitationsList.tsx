import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InvitationItem } from "./InvitationItem";
import { Loader2, UserPlus, Users, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BatchInviteDialog } from "../batch-invite/BatchInviteDialog";
import { InviteMembers } from "../InviteMembers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface EventInvitationsListProps {
  eventId: string;
  isOrganizer: boolean;
}

export function EventInvitationsList({ eventId, isOrganizer }: EventInvitationsListProps) {
  const { toast } = useToast();
  const [isBatchInviteOpen, setIsBatchInviteOpen] = useState(false);
  const [isInviteMembersOpen, setIsInviteMembersOpen] = useState(false);
  
  const { 
    data: invitations, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['event-invitations', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_invitations')
        .select(`
          id,
          event_id,
          status,
          created_at,
          email_sent,
          email_sent_at,
          last_viewed_at,
          expiration_date,
          invitee:profiles!event_invitations_invitee_id_fkey(
            id, 
            full_name, 
            avatar_url,
            email_notifications
          )
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
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
        description: "The invitation has been cancelled successfully.",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel invitation.",
        variant: "destructive",
      });
    }
  };

  if (!isOrganizer) return null;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load invitations. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const pendingInvitations = invitations?.filter(inv => inv.status === 'pending') || [];
  const acceptedInvitations = invitations?.filter(inv => inv.status === 'accepted') || [];
  const rejectedInvitations = invitations?.filter(inv => inv.status === 'rejected') || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Invitations</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsInviteMembersOpen(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsBatchInviteOpen(true)}
          >
            <Users className="h-4 w-4 mr-2" />
            Batch Invite
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Pending
              {pendingInvitations.length > 0 && (
                <Badge variant="secondary">{pendingInvitations.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted
              {acceptedInvitations.length > 0 && (
                <Badge variant="secondary" className="ml-2">{acceptedInvitations.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected
              {rejectedInvitations.length > 0 && (
                <Badge variant="secondary" className="ml-2">{rejectedInvitations.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <ScrollArea className="h-[400px] rounded-md border">
              <div className="p-4 space-y-6">
                {pendingInvitations.map((invitation) => (
                  <InvitationItem
                    key={invitation.id}
                    invitation={invitation}
                    onRemove={handleCancelInvitation}
                  />
                ))}
                {pendingInvitations.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No pending invitations
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="accepted">
            <ScrollArea className="h-[400px] rounded-md border">
              <div className="p-4 space-y-6">
                {acceptedInvitations.map((invitation) => (
                  <InvitationItem
                    key={invitation.id}
                    invitation={invitation}
                    onRemove={handleCancelInvitation}
                  />
                ))}
                {acceptedInvitations.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No accepted invitations
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="rejected">
            <ScrollArea className="h-[400px] rounded-md border">
              <div className="p-4 space-y-6">
                {rejectedInvitations.map((invitation) => (
                  <InvitationItem
                    key={invitation.id}
                    invitation={invitation}
                    onRemove={handleCancelInvitation}
                  />
                ))}
                {rejectedInvitations.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No rejected invitations
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      )}

      <BatchInviteDialog
        eventId={eventId}
        open={isBatchInviteOpen}
        onOpenChange={setIsBatchInviteOpen}
      />

      <InviteMembers
        eventId={eventId}
        isOrganizer={isOrganizer}
      />
    </div>
  );
}