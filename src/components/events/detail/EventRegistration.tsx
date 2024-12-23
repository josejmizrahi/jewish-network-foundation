import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/auth-helpers-react";
import { Card } from "@/components/ui/card";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isFull = maxCapacity !== null && currentAttendees >= maxCapacity;
  const canJoinWaitlist = isFull && waitlistEnabled && !isRegistered;

  const handleRegister = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register for events.",
        variant: "destructive",
      });
      return;
    }

    try {
      const registrationType = isFull && waitlistEnabled ? 'waitlist' : 'registered';
      
      const { error } = await supabase
        .from('event_attendees')
        .insert({
          event_id: eventId,
          user_id: user.id,
          registration_type: registrationType,
          waitlist_position: registrationType === 'waitlist' ? currentAttendees - maxCapacity! + 1 : null
        });

      if (error) throw error;

      toast({
        title: registrationType === 'waitlist' ? "Added to waitlist" : "Registration successful",
        description: registrationType === 'waitlist' 
          ? "You have been added to the waitlist for this event."
          : "You have been registered for this event.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['event-registration', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-attendees', eventId] });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register for the event.",
        variant: "destructive",
      });
    }
  };

  const getButtonText = () => {
    if (status === 'cancelled') return "Event Cancelled";
    if (isRegistered) return "Already Registered";
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
          onClick={handleRegister}
          disabled={isRegistered || !user || status === 'cancelled' || (isFull && !waitlistEnabled)}
        >
          {getButtonText()}
        </Button>
      </div>
    </Card>
  );
}