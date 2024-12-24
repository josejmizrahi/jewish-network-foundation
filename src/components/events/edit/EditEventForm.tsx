import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { EventFormFields } from "../EventFormFields";
import type { EventFormValues } from "../schemas/eventFormSchema";
import { UseFormReturn } from "react-hook-form";

interface EditEventFormProps {
  form: UseFormReturn<EventFormValues>;
  onSubmit: (data: EventFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function EditEventForm({ form, onSubmit, onCancel, isSubmitting }: EditEventFormProps) {
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