import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/auth-helpers-react";

interface EventRegistrationProps {
  eventId: string;
  isRegistered: boolean;
  status: string;
  user: User | null;
}

export function EventRegistration({ 
  eventId, 
  isRegistered, 
  status,
  user 
}: EventRegistrationProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      const { error } = await supabase
        .from('event_attendees')
        .insert({
          event_id: eventId,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Registration successful",
        description: "You have been registered for this event.",
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

  return (
    <div className="flex justify-end">
      <Button
        onClick={handleRegister}
        disabled={isRegistered || !user || status === 'cancelled'}
      >
        {status === 'cancelled' 
          ? "Event Cancelled" 
          : isRegistered 
            ? "Already Registered" 
            : "Register for Event"}
      </Button>
    </div>
  );
}