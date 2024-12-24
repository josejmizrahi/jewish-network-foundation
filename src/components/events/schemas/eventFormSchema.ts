import * as z from "zod";

const CATEGORIES = [
  'conference',
  'workshop',
  'meetup',
  'social',
  'sports',
  'entertainment',
  'education',
  'business',
  'charity',
  'other'
] as const;

export const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  start_time: z.date(),
  end_time: z.date(),
  timezone: z.string(),
  location: z.string().optional(),
  is_online: z.boolean().default(false),
  meeting_url: z.string().url().optional(),
  max_capacity: z.number().int().positive().optional(),
  is_private: z.boolean().default(false),
  cover_image: z.string().optional(),
  category: z.enum(CATEGORIES).default('other'),
  tags: z.array(z.string()).default([]),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
export type EventCategory = typeof CATEGORIES[number];