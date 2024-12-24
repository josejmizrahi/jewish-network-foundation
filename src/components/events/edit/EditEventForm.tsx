import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { EventFormFields } from "../EventFormFields";
import { eventFormSchema, type EventFormValues, type EventCategory } from "../schemas/eventFormSchema";
import { toZonedTime } from "date-fns-tz";

interface EditEventFormProps {
  initialData: {
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

export function EditEventForm({ initialData, onSubmit, onCancel, isSubmitting }: EditEventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: initialData.title,
      description: initialData.description || "",
      start_time: toZonedTime(new Date(initialData.start_time), initialData.timezone),
      end_time: toZonedTime(new Date(initialData.end_time), initialData.timezone),
      timezone: initialData.timezone,
      location: initialData.location || "",
      is_online: initialData.is_online,
      meeting_url: initialData.meeting_url || "",
      max_capacity: initialData.max_capacity || undefined,
      is_private: initialData.is_private,
      cover_image: initialData.cover_image || "",
      category: initialData.category,
      tags: initialData.tags,
    },
  });

  return (
    <Form {...form}>
      <div className="space-y-6">
        <EventFormFields form={form} />
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </Form>
  );
}