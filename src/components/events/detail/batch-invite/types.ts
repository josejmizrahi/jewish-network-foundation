import { z } from "zod";

export const batchInviteSchema = z.object({
  emails: z.string().min(1, "Please enter at least one email"),
  message: z.string().optional(),
  expirationDays: z.number().min(1).max(30).default(7),
});

export type BatchInviteFormValues = z.infer<typeof batchInviteSchema>;