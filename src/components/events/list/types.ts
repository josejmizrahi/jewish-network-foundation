import { EventCategory } from "../schemas/eventFormSchema";

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
  cover_image: string | null;
  status: string;
  is_private: boolean;
  category: EventCategory;
  category_color: string;
  tags: string[];
  organizer_id: string;
  waitlist_enabled: boolean;
  organizer: {
    full_name: string;
    avatar_url: string | null;
  } | null;
  invitation_id?: string;
  invitation_status?: string;
}

export const categoryColors: Record<string, string> = {
  workshop: "bg-blue-500/20 text-blue-500",
  meetup: "bg-green-500/20 text-green-500",
  conference: "bg-purple-500/20 text-purple-500",
  social: "bg-orange-500/20 text-orange-500",
  other: "bg-gray-500/20 text-gray-500",
};