import * as z from "zod";

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

export const subEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  start_time: z.date(),
  end_time: z.date(),
  location: z.string().optional(),
  is_online: z.boolean().default(false),
  meeting_url: z.string().url().optional().or(z.literal("")),
  icon: z.enum(["Calendar", "Clock", "Video", "MapPin", "Music", "Users", "Utensils", "Book", "Presentation"]).default("Calendar"),
});

export type SubEventFormValues = z.infer<typeof subEventSchema>;