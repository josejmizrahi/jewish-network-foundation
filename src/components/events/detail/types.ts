export interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  is_online: boolean;
  meeting_url: string | null;
  max_capacity: number | null;
  current_attendees: number;
  status: string;
  is_private: boolean;
  timezone: string;
  organizer_id: string;
  cover_image: string | null;
  waitlist_enabled: boolean;
  organizer: {
    full_name: string;
    avatar_url: string;
  } | null;
}