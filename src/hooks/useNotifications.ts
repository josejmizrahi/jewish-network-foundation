import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { EventInvitation } from "@/types/notifications";
import { useEffect } from "react";
import useSound from "use-sound";

// Import notification sound
const notificationSound = "/notification.mp3";

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [playSound] = useSound(notificationSound);

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

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('invitation-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'event_invitations',
          filter: `invitee_id=eq.${user.id}`,
        },
        (payload) => {
          // Play sound for new notifications
          playSound();
          // Invalidate the notifications query to refresh the data
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient, playSound]);

  const { mutate: markAllAsRead } = useMutation({
    mutationFn: async () => {
      if (!user || !notifications.length) return;

      const { error } = await supabase
        .from('event_invitations')
        .update({ last_viewed_at: new Date().toISOString() })
        .eq('invitee_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications,
    isLoading,
    error,
    markAllAsRead,
  };
}