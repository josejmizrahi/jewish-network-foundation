import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import type { EventFormValues } from "../schemas/eventFormSchema";
import { MapLocation } from "./MapLocation";

interface EventLocationFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export function EventLocationFields({ form }: EventLocationFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="is_online"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Online Event</FormLabel>
              <div className="text-sm text-muted-foreground">
                This event will be hosted online
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

      {form.watch("is_online") ? (
        <FormField
          control={form.control}
          name="meeting_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <MapLocation 
                  value={field.value || ''} 
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="max_capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Capacity (Optional)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Leave empty for unlimited" 
                {...field}
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}