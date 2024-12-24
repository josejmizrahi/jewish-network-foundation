import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/components/ui/use-toast";
import { EventInvitation } from "@/types/notifications";

export function useNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: notifications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('event_invitations')
        .select(`
          id,
          status,
          created_at,
          last_viewed_at,
          email_sent,
          email_sent_at,
          event:events!inner(
            *,
            organizer:profiles!events_organizer_id_fkey(
              full_name,
              avatar_url
            )
          )
        `)
        .eq('invitee_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EventInvitation[];
    },
    enabled: !!user,
  });

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
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['event-invitations'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update invitation status.",
        variant: "destructive",
      });
    }
  };

  return {
    notifications,
    isLoading,
    error,
    handleInvitationResponse,
  };
}