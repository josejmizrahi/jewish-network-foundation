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
    <Card className="p-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <h3 className="text-xl font-semibold">
          {status === 'cancelled' 
            ? "This event has been cancelled" 
            : isRegistered 
              ? "You're registered!"
              : "Register for this event"}
        </h3>
        <p className="text-muted-foreground">
          {status === 'cancelled' 
            ? "The organizer has cancelled this event."
            : isRegistered 
              ? "We look forward to seeing you there!"
              : "Secure your spot for this exciting event."}
        </p>
        <Button
          className="w-full rounded-full"
          size="lg"
          onClick={handleRegister}
          disabled={isRegistered || !user || status === 'cancelled'}
        >
          {status === 'cancelled' 
            ? "Event Cancelled" 
            : isRegistered 
              ? "Already Registered" 
              : "Register Now"}
        </Button>
      </div>
    </Card>
  );
}