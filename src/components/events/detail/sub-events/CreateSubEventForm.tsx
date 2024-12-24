import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { SubEventFormFields } from "./SubEventFormFields";
import { SubEventFormValues, subEventSchema } from "./types";

interface CreateSubEventFormProps {
  eventId: string;
}

export function CreateSubEventForm({ eventId }: CreateSubEventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SubEventFormValues>({
    resolver: zodResolver(subEventSchema),
    defaultValues: {
      title: "",
      description: "",
      start_time: new Date(),
      end_time: new Date(),
      is_online: false,
      location: "",
      meeting_url: "",
      icon: "calendar",
    },
  });

  const onSubmit = async (values: SubEventFormValues) => {
    if (values.end_time <= values.start_time) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('sub_events')
        .insert({
          event_id: eventId,
          title: values.title,
          description: values.description,
          start_time: values.start_time.toISOString(),
          end_time: values.end_time.toISOString(),
          location: values.location,
          is_online: values.is_online,
          meeting_url: values.meeting_url,
          icon: values.icon,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sub-event created successfully",
      });

      form.reset();
      queryClient.invalidateQueries({ queryKey: ['sub-events', eventId] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create sub-event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <SubEventFormFields form={form} />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Sub-event
        </Button>
      </form>
    </Form>
  );
}