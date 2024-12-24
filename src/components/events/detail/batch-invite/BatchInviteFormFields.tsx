import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BatchInviteFormValues } from "./types";

interface BatchInviteFormFieldsProps {
  form: UseFormReturn<BatchInviteFormValues>;
}

export function BatchInviteFormFields({ form }: BatchInviteFormFieldsProps) {
  return (
    <>
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
    </>
  );
}