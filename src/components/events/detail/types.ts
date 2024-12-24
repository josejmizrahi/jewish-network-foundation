export type EventCategory = 
  | "conference"
  | "workshop"
  | "meetup"
  | "social"
  | "sports"
  | "entertainment"
  | "education"
  | "business"
  | "charity"
  | "other";

export interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  timezone: string;
  location: string | null;
  is_online: boolean;
  meeting_url: string | null;
  max_capacity: number | null;
  current_attendees: number;
  status: string;
  is_private: boolean;
  cover_image: string | null;
  organizer_id: string;
  category: EventCategory;
  tags: string[];
  waitlist_enabled: boolean;
  organizer: {
    full_name: string;
    avatar_url: string;
  } | null;
}