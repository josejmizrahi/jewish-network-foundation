import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseEventRegistrationProps {
  eventId: string;
  userId: string | undefined;
  maxCapacity: number | null;
  currentAttendees: number;
  waitlistEnabled: boolean;
}

export function useEventRegistration({
  eventId,
  userId,
  maxCapacity,
  currentAttendees,
  waitlistEnabled,
}: UseEventRegistrationProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isFull = maxCapacity !== null && currentAttendees >= maxCapacity;
  const canJoinWaitlist = isFull && waitlistEnabled;

  const sendNotification = async (userId: string, type: string, status?: string) => {
    try {
      await supabase.functions.invoke('send-status-notification', {
        body: { eventId, userId, type, status }
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const handleRegister = async () => {
    if (!userId) {
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
          user_id: userId,
          registration_type: registrationType,
          waitlist_position: waitlistPosition
        });

      if (error) throw error;

      await sendNotification(userId, 'registration_update', registrationType);

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
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('event_attendees')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);

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

  return {
    isFull,
    canJoinWaitlist,
    handleRegister,
    handleCancelRegistration,
  };
}