import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { User } from "@supabase/auth-helpers-react";
import { useEventRegistration } from "./useEventRegistration";

interface EventRegistrationProps {
  eventId: string;
  isRegistered: boolean;
  status: string;
  user: User | null;
  currentAttendees: number;
  maxCapacity: number | null;
  waitlistEnabled: boolean;
}

export function EventRegistration({ 
  eventId, 
  isRegistered, 
  status,
  user,
  currentAttendees,
  maxCapacity,
  waitlistEnabled
}: EventRegistrationProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {
    isFull,
    canJoinWaitlist,
    handleRegister,
    handleCancelRegistration,
  } = useEventRegistration({
    eventId,
    userId: user?.id,
    maxCapacity,
    currentAttendees,
    waitlistEnabled,
  });

  const getButtonText = () => {
    if (status === 'cancelled') return "Event Cancelled";
    if (isRegistered) return "Cancel Registration";
    if (canJoinWaitlist) return "Join Waitlist";
    if (isFull && !waitlistEnabled) return "Event Full";
    return "Register Now";
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center text-center space-y-4">
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
        {maxCapacity && (
          <p className="text-sm text-muted-foreground">
            {currentAttendees} / {maxCapacity} spots filled
          </p>
        )}
        <Button
          className="w-full rounded-full"
          size="lg"
          onClick={isRegistered ? () => setIsConfirmOpen(true) : handleRegister}
          disabled={!user || status === 'cancelled' || (isFull && !waitlistEnabled && !isRegistered)}
          variant={isRegistered ? "destructive" : "default"}
        >
          {getButtonText()}
        </Button>
      </div>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Registration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your registration? If there's a waitlist, your spot will be given to the next person in line.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Registration</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelRegistration}>
              Cancel Registration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}