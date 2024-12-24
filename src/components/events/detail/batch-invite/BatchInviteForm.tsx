import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const batchInviteSchema = z.object({
  emails: z.string().min(1, "Please enter at least one email"),
  message: z.string().optional(),
  expirationDays: z.number().min(1).max(30).default(7),
});

export type BatchInviteFormValues = z.infer<typeof batchInviteSchema>;

interface BatchInviteFormProps {
  onSubmit: (data: BatchInviteFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function BatchInviteForm({ onSubmit, isSubmitting, onCancel }: BatchInviteFormProps) {
  const form = useForm<BatchInviteFormValues>({
    resolver: zodResolver(batchInviteSchema),
    defaultValues: {
      emails: "",
      message: "",
      expirationDays: 7,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="emails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Addresses</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter email addresses (one per line or comma-separated)"
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter multiple email addresses, separated by commas or new lines
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Message (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a personal message to the invitation"
                  className="h-24"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expirationDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invitation Expiration (Days)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Invitations will expire after this many days
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send Invitations
          </Button>
        </div>
      </form>
    </Form>
  );
}