import { Event } from "../types";
import { EmptyState } from "../EmptyState";
import { InvitationCard } from "../InvitationCard";

interface InvitationsListProps {
  events: Event[];
}

export function InvitationsList({ events }: InvitationsListProps) {
  if (events.length === 0) {
    return (
      <EmptyState 
        hasFilters={false}
        message="No invitations found"
      />
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <InvitationCard
          key={event.id}
          event={event}
          invitationId={event.invitation_id!}
          invitationStatus={event.invitation_status!}
        />
      ))}
    </div>
  );
}