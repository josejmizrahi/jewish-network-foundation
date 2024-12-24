import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/auth-helpers-react";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const sendNotification = async (userId: string, type: string, status?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-status-notification', {
        body: { eventId, userId, type, status }
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Failed to send notification:', error);
      // Don't throw the error - we don't want to block the registration process
      // if notification fails
    }
  };

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
      
      let waitlistPosition = null;
      if (registrationType === 'waitlist') {
        const { data: waitlistCount } = await supabase
          .from('event_attendees')
          .select('count')
          .eq('event_id', eventId)
          .eq('registration_type', 'waitlist')
          .single();
        
        waitlistPosition = (waitlistCount?.count || 0) + 1;
      }

      const { error } = await supabase
        .from('event_attendees')
        .insert({
          event_id: eventId,
          user_id: user.id,
          registration_type: registrationType,
          waitlist_position: waitlistPosition
        });

      if (error) throw error;

      // Send notification
      await sendNotification(user.id, 'registration_update', registrationType);

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

  const handleCancelRegistration = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('event_attendees')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Registration cancelled",
        description: "Your registration has been cancelled successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['event-registration', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-attendees', eventId] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel registration.",
        variant: "destructive",
      });
    }
  };

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
