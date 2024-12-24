interface RegistrationStatusProps {
  status: string;
  isRegistered: boolean;
  canJoinWaitlist: boolean;
  isFull: boolean;
}

export function RegistrationStatus({ 
  status, 
  isRegistered, 
  canJoinWaitlist, 
  isFull 
}: RegistrationStatusProps) {
  return (
    <>
      <h3 className="text-xl font-semibold">
        {status === 'cancelled' 
          ? "This event has been cancelled" 
          : isRegistered 
            ? "You're registered!"
            : canJoinWaitlist
              ? "Event is full - Waitlist available"
              : isFull
                ? "Event is full"
                : "Register for this event"}
      </h3>
      <p className="text-muted-foreground">
        {status === 'cancelled' 
          ? "The organizer has cancelled this event."
          : isRegistered 
            ? "We look forward to seeing you there!"
            : canJoinWaitlist
              ? "Join the waitlist to be notified if spots become available."
              : isFull
                ? "This event has reached maximum capacity."
                : "Secure your spot for this exciting event."}
      </p>
    </>
  );
}