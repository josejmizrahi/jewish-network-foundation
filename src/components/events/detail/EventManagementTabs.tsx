import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventAttendeesList } from "./attendees/EventAttendeesList";
import { EventInvitationsList } from "./invitations/EventInvitationsList";
import { CreateSubEventForm } from "./sub-events/CreateSubEventForm";

interface EventManagementTabsProps {
  eventId: string;
  isOrganizer: boolean;
}

export function EventManagementTabs({ eventId, isOrganizer }: EventManagementTabsProps) {
  if (!isOrganizer) return null;

  return (
    <Tabs defaultValue="attendees" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="attendees">Attendees</TabsTrigger>
        <TabsTrigger value="invitations">Invitations</TabsTrigger>
        <TabsTrigger value="sub-events">Sub-events</TabsTrigger>
      </TabsList>
      
      <TabsContent value="attendees">
        <EventAttendeesList eventId={eventId} />
      </TabsContent>
      
      <TabsContent value="invitations">
        <EventInvitationsList eventId={eventId} />
      </TabsContent>

      <TabsContent value="sub-events">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Add Sub-event</h3>
          <CreateSubEventForm eventId={eventId} />
        </div>
      </TabsContent>
    </Tabs>
  );
}