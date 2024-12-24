import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Mail, UserPlus } from "lucide-react";
import { EventAttendeesList } from "./attendees/EventAttendeesList";
import { EventInvitationsList } from "./invitations/EventInvitationsList";
import { InviteMembers } from "./InviteMembers";
import { BatchInviteDialog } from "./BatchInviteDialog";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ui/error-boundary";

interface EventManagementTabsProps {
  eventId: string;
  isOrganizer: boolean;
}

export function EventManagementTabs({ eventId, isOrganizer }: EventManagementTabsProps) {
  const [isBatchInviteOpen, setIsBatchInviteOpen] = useState(false);

  if (!isOrganizer) return null;

  return (
    <ErrorBoundary>
      <Tabs defaultValue="attendees" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="attendees" className="flex items-center gap-2 flex-1">
            <Users className="h-4 w-4" />
            Attendees
          </TabsTrigger>
          <TabsTrigger value="invitations" className="flex items-center gap-2 flex-1">
            <Mail className="h-4 w-4" />
            Invitations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendees" className="mt-4">
          <EventAttendeesList eventId={eventId} isOrganizer={isOrganizer} />
        </TabsContent>
        
        <TabsContent value="invitations" className="mt-4 space-y-4">
          <div className="flex gap-4">
            <InviteMembers eventId={eventId} isOrganizer={isOrganizer} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBatchInviteOpen(true)}
              className="flex-1"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Batch Invite
            </Button>
          </div>
          <EventInvitationsList eventId={eventId} isOrganizer={isOrganizer} />
        </TabsContent>
      </Tabs>

      <BatchInviteDialog
        eventId={eventId}
        open={isBatchInviteOpen}
        onOpenChange={setIsBatchInviteOpen}
      />
    </ErrorBoundary>
  );
}