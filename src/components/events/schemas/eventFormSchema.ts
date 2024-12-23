import * as z from "zod";

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
});

export type EventFormValues = z.infer<typeof eventFormSchema>;