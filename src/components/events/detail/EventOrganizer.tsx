interface EventOrganizerProps {
  organizerName: string;
}

export function EventOrganizer({ organizerName }: EventOrganizerProps) {
  return (
    <div className="pt-4 border-t">
      <p className="text-sm text-muted-foreground">
        Organized by {organizerName}
      </p>
    </div>
  );
}