import { Event } from "../types";
import { memo } from "react";
import { EmptyState } from "../EmptyState";
import { EventDateGroup } from "../EventDateGroup";
import { categoryColors } from "../types";

interface InvitationsListProps {
  events: Event[];
}

function InvitationsListComponent({ events }: InvitationsListProps) {
  if (events.length === 0) {
    return (
      <EmptyState 
        message="You have no invitations at this time." 
        hasFilters={false}
      />
    );
  }

  const groupedEvents = events.reduce((acc, event) => {
    const date = new Date(event.start_time).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <div className="mt-8 space-y-8">
      {Object.entries(groupedEvents).map(([date, dateEvents]) => (
        <EventDateGroup
          key={date}
          date={date}
          events={dateEvents}
          categoryColors={categoryColors}
        />
      ))}
    </div>
  );
}

export const InvitationsList = memo(InvitationsListComponent);