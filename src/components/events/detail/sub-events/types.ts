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