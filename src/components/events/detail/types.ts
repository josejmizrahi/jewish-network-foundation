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
  cover_image: string | null;
  organizer_id: string;
  status: string;
  is_private: boolean;
  is_shareable: boolean;
  category: EventCategory;
  tags: string[];
  luma_id: string | null;
  organizer: {
    full_name: string;
    avatar_url: string | null;
  } | null;
}