import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { DateTimePicker } from "@/components/ui/date-time-picker/date-time-picker";
import { UseFormReturn } from "react-hook-form";
import type { EventFormValues } from "../schemas/eventFormSchema";

interface EventDateTimeFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export function EventDateTimeFields({ form }: EventDateTimeFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="start_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Date & Time</FormLabel>
            <FormControl>
              <DateTimePicker
                date={field.value}
                setDate={field.onChange}
                disabled={(date) => date < new Date()}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="end_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Date & Time</FormLabel>
            <FormControl>
              <DateTimePicker
                date={field.value}
                setDate={field.onChange}
                disabled={(date) => date < form.getValues("start_time")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}