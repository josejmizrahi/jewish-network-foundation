import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Mail } from "lucide-react";
import { EventAttendeesList } from "./attendees/EventAttendeesList";
import { EventInvitationsList } from "./invitations/EventInvitationsList";
import { InviteMembers } from "./InviteMembers";

interface EventManagementTabsProps {
  eventId: string;
  isOrganizer: boolean;
}

export function EventManagementTabs({ eventId, isOrganizer }: EventManagementTabsProps) {
  if (!isOrganizer) return null;

  return (
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
        <InviteMembers eventId={eventId} isOrganizer={isOrganizer} />
        <EventInvitationsList eventId={eventId} isOrganizer={isOrganizer} />
      </TabsContent>
    </Tabs>
  );
}