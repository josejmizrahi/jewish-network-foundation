import { Event } from "@/components/events/list/types";

export type NotificationType = 'invitation' | 'registration_update' | 'event_reminder';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  data: {
    eventId?: string;
    invitationId?: string;
    status?: string;
  };
}

export interface EventInvitation {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  last_viewed_at: string | null;
  email_sent: boolean;
  email_sent_at: string | null;
  event: Event & {
    organizer: {
      full_name: string;
      avatar_url: string | null;
    };
  };
  // Make invitee optional since it's not always returned from the API
  invitee?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    email_notifications: boolean;
  };
}