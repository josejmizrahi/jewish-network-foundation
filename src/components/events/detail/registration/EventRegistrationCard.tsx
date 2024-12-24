import { Card } from "@/components/ui/card";
import { User } from "@supabase/auth-helpers-react";
import { InvitationActions } from "../../list/InvitationActions";
import { EventRegistration } from "./EventRegistration";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EventRegistrationCardProps {
  eventId: string;
  isRegistered: boolean;
  status: string;
  user: User | null;
  currentAttendees: number;
  maxCapacity: number | null;
  waitlistEnabled: boolean;
}

export function EventRegistrationCard({
  eventId,
  isRegistered,
  status,
  user,
  currentAttendees,
  maxCapacity,
  waitlistEnabled,
}: EventRegistrationCardProps) {
  // Check if user is invited
  const { data: invitation } = useQuery({
    queryKey: ['event-invitation', eventId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('event_invitations')
        .select('*')
        .eq('event_id', eventId)
        .eq('invitee_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user && !!eventId,
  });

  return (
    <Card className="p-6">
      {invitation ? (
        <div className="flex flex-col items-center text-center space-y-4">
          <h3 className="text-xl font-semibold">
            {status === 'cancelled' 
              ? "This event has been cancelled"
              : "You're invited!"}
          </h3>
          <p className="text-muted-foreground">
            {status === 'cancelled'
              ? "The organizer has cancelled this event."
              : "Would you like to attend this event?"}
          </p>
          {maxCapacity && (
            <p className="text-sm text-muted-foreground">
              {currentAttendees} / {maxCapacity} spots filled
            </p>
          )}
          <div className="w-full">
            <InvitationActions
              invitationId={invitation.id}
              status={invitation.status}
            />
          </div>
        </div>
      ) : (
        <EventRegistration
          eventId={eventId}
          isRegistered={isRegistered}
          status={status}
          user={user}
          currentAttendees={currentAttendees}
          maxCapacity={maxCapacity}
          waitlistEnabled={waitlistEnabled}
        />
      )}
    </Card>
  );
}