import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { EventFormFields } from "./EventFormFields";
import { eventFormSchema, type EventFormValues } from "./schemas/eventFormSchema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fromZonedTime } from "date-fns-tz";
import { useNavigate } from "react-router-dom";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEventDialog({ open, onOpenChange }: CreateEventDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      start_time: new Date(),
      end_time: new Date(),
      timezone: userTimezone,
      is_online: false,
      is_private: false,
      max_capacity: undefined,
      category: "other",
      tags: [],
    },
  });

  const onSubmit = async (data: EventFormValues) => {
    if (!user) return;
    
    if (data.end_time <= data.start_time) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Convert times to UTC for storage
      const utcStartTime = fromZonedTime(data.start_time, data.timezone);
      const utcEndTime = fromZonedTime(data.end_time, data.timezone);

      const formattedData = {
        ...data,
        title: data.title,
        start_time: utcStartTime.toISOString(),
        end_time: utcEndTime.toISOString(),
        organizer_id: user.id,
        status: 'published',
        current_attendees: 0,
        timezone: data.timezone || userTimezone,
      };

      // Create event in Supabase
      const { data: newEvent, error } = await supabase
        .from('events')
        .insert(formattedData)
        .select()
        .single();

      if (error) throw error;

      // Sync with Luma
      try {
        const { data: lumaData, error: lumaError } = await supabase.functions.invoke('luma-api', {
          body: { 
            action: 'create',
            eventData: {
              ...formattedData,
              cover_image: data.cover_image || undefined,
            }
          }
        });

        if (lumaError) throw lumaError;

        // Update event with Luma ID
        if (lumaData?.id) {
          const { error: updateError } = await supabase
            .from('events')
            .update({ luma_id: lumaData.id })
            .eq('id', newEvent.id);

          if (updateError) {
            console.error('Failed to update Luma ID:', updateError);
          }
        }
      } catch (lumaError) {
        console.error('Luma sync error:', lumaError);
        toast({
          title: "Warning",
          description: "Event created but failed to sync with Luma. Please try syncing again later.",
          variant: "destructive",
        });
      }

      toast({
        title: "Event created",
        description: "Your event has been created successfully.",
      });
      
      onOpenChange(false);
      form.reset();

      // If it's a private event, navigate to the event details page
      if (data.is_private && newEvent) {
        navigate(`/events/${newEvent.id}`, { 
          state: { showInviteDialog: true }
        });
      }
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