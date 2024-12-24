import * as z from "zod";
import { SubEventIcon } from "./SubEventIconSelect";

export const subEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  start_time: z.date(),
  end_time: z.date(),
  location: z.string().optional(),
  is_online: z.boolean().default(false),
  meeting_url: z.string().url().optional().or(z.literal("")),
  icon: z.custom<SubEventIcon>(),
});

export type SubEventFormValues = z.infer<typeof subEventSchema>;