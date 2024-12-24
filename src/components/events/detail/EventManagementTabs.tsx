import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventAttendeesList } from "./attendees/EventAttendeesList";
import { EventInvitationsList } from "./invitations/EventInvitationsList";
import { CreateSubEventForm } from "./sub-events/CreateSubEventForm";

interface EventManagementTabsProps {
  eventId: string;
  isOrganizer: boolean;
  eventStartTime: Date;
  eventEndTime: Date;
}

export function EventManagementTabs({ eventId, isOrganizer, eventStartTime, eventEndTime }: EventManagementTabsProps) {
  if (!isOrganizer) return null;

  return (
    <Tabs defaultValue="attendees" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="attendees">Attendees</TabsTrigger>
        <TabsTrigger value="invitations">Invitations</TabsTrigger>
        <TabsTrigger value="sub-events">Sub-events</TabsTrigger>
      </TabsList>
      
      <TabsContent value="attendees">
        <EventAttendeesList eventId={eventId} isOrganizer={isOrganizer} />
      </TabsContent>
      
      <TabsContent value="invitations">
        <EventInvitationsList eventId={eventId} isOrganizer={isOrganizer} />
      </TabsContent>

      <TabsContent value="sub-events">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Add Sub-event</h3>
          <CreateSubEventForm 
            eventId={eventId} 
            eventStartTime={eventStartTime}
            eventEndTime={eventEndTime}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}