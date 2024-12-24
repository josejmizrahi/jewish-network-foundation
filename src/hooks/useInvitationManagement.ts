import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useInvitationManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleInvitationResponse = async (invitationId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('event_invitations')
        .update({ 
          status,
          last_viewed_at: new Date().toISOString()
        })
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: `Invitation ${status}`,
        description: `You have ${status} the event invitation.`,
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['event-invitations'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update invitation status.",
        variant: "destructive",
      });
    }
  };

  return { handleInvitationResponse };
}