import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { BatchInviteFormValues } from "./BatchInviteForm";

export function useBatchInvite(eventId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleBatchInvite = async (data: BatchInviteFormValues) => {
    setIsSubmitting(true);
    try {
      const emails = data.emails.split(/[\n,]/).map(email => email.trim()).filter(Boolean);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Create batch
      const { data: batch, error: batchError } = await supabase
        .from('event_invitation_batches')
        .insert({
          event_id: eventId,
          created_by: user.id,
          email_template: data.message,
          total_invitations: emails.length,
        })
        .select()
        .single();

      if (batchError) throw batchError;

      // Get profiles for existing users
      const { data: existingProfiles } = await supabase
        .from('profiles')
        .select('id')
        .in('email', emails);

      const existingUserIds = existingProfiles?.map(p => p.id) || [];

      // Calculate expiration date
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + data.expirationDays);

      // Create invitations
      if (existingUserIds.length > 0) {
        const invitations = existingUserIds.map(userId => ({
          event_id: eventId,
          inviter_id: user.id,
          invitee_id: userId,
          batch_id: batch.id,
          expiration_date: expirationDate.toISOString(),
        }));

        const { error: inviteError } = await supabase
          .from('event_invitations')
          .insert(invitations);

        if (inviteError) throw inviteError;
      }

      // Update batch status
      await supabase
        .from('event_invitation_batches')
        .update({
          sent_invitations: existingUserIds.length,
          failed_invitations: emails.length - existingUserIds.length,
          status: 'completed',
        })
        .eq('id', batch.id);

      toast({
        title: "Invitations sent",
        description: `Successfully sent ${existingUserIds.length} invitations.`,
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send invitations.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleBatchInvite,
  };
}