import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import type { EventFormValues } from "../schemas/eventFormSchema";

interface EventPrivacyFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export function EventPrivacyFields({ form }: EventPrivacyFieldsProps) {
  return (
    <FormField
      control={form.control}
      name="is_private"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Private Event</FormLabel>
            <div className="text-sm text-muted-foreground">
              Only invited members can see and join this event
            </div>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}