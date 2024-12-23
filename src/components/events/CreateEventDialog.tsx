import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { EventFormFields } from "./EventFormFields";
import { eventFormSchema, type EventFormValues } from "./schemas/eventFormSchema";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEventDialog({ open, onOpenChange }: CreateEventDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      start_time: new Date(),
      end_time: new Date(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      is_online: false,
      is_private: false,
    },
  });

  const onSubmit = async (data: EventFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...data,
        start_time: data.start_time.toISOString(),
        end_time: data.end_time.toISOString(),
        organizer_id: user.id,
        status: 'published',
        timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        title: data.title,
      };

      const { error } = await supabase
        .from('events')
        .insert(formattedData);

      if (error) throw error;

      toast({
        title: "Event created",
        description: "Your event has been created successfully.",
      });
      
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <EventFormFields form={form} />
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Event
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}