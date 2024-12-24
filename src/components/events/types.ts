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
  category_color: string;
  tags: string[];
  waitlist_enabled: boolean;
  organizer: {
    full_name: string;
    avatar_url: string | null;
  } | null;
  invitation_status?: string;
  attendees?: Array<{ user_id: string }>;
  batch_id?: string;
  invitation_id?: string;
}

export const categoryColors: Record<string, string> = {
  conference: "bg-purple-500/20 text-purple-500",
  workshop: "bg-blue-500/20 text-blue-500",
  meetup: "bg-green-500/20 text-green-500",
  social: "bg-orange-500/20 text-orange-500",
  sports: "bg-red-500/20 text-red-500",
  entertainment: "bg-pink-500/20 text-pink-500",
  education: "bg-indigo-500/20 text-indigo-500",
  business: "bg-yellow-500/20 text-yellow-500",
  charity: "bg-emerald-500/20 text-emerald-500",
  other: "bg-gray-500/20 text-gray-500",
};