import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { EventFormFields } from "../EventFormFields";
import { eventFormSchema, type EventFormValues, type EventCategory } from "../schemas/eventFormSchema";

interface EditEventFormProps {
  event: {
    id: string;
    title: string;
    description: string | null;
    start_time: string;
    end_time: string;
    timezone: string;
    location: string | null;
    is_online: boolean;
    meeting_url: string | null;
    max_capacity: number | null;
    is_private: boolean;
    cover_image: string | null;
    category: EventCategory;
    tags: string[];
  };
  onSubmit: (data: EventFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function EditEventForm({ event, onSubmit, onCancel, isSubmitting }: EditEventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: event.title,
      description: event.description || "",
      start_time: new Date(event.start_time),
      end_time: new Date(event.end_time),
      timezone: event.timezone,
      location: event.location || "",
      is_online: event.is_online,
      meeting_url: event.meeting_url || "",
      max_capacity: event.max_capacity || undefined,
      is_private: event.is_private,
      cover_image: event.cover_image || "",
      category: event.category,
      tags: event.tags || [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <EventFormFields form={form} />
        
        <div className="flex justify-end space-x-4">
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
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}