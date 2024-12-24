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

export type SubEventIcon = 
  | "Calendar"
  | "Clock"
  | "Video"
  | "MapPin"
  | "Music"
  | "Users"
  | "Utensils"
  | "Book"
  | "Presentation";

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
  is_shareable: boolean;
  cover_image: string | null;
  organizer_id: string;
  category: EventCategory;
  tags: string[];
  waitlist_enabled: boolean;
  luma_id: string | null;
  organizer: {
    full_name: string;
    avatar_url: string | null;
  } | null;
}

export interface SubEvent {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  is_online: boolean;
  meeting_url: string | null;
  icon?: SubEventIcon;
}