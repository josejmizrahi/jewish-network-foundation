import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import { EditEventForm } from "./edit/EditEventForm";
import type { EventFormValues, EventCategory } from "./schemas/eventFormSchema";
import { fromZonedTime } from "date-fns-tz";

interface EditEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
}

export function EditEventDialog({ open, onOpenChange, event }: EditEventDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: EventFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Convert times to UTC for storage
      const utcStartTime = fromZonedTime(data.start_time, data.timezone);
      const utcEndTime = fromZonedTime(data.end_time, data.timezone);

      const { error } = await supabase
        .from('events')
        .update({
          title: data.title,
          description: data.description,
          start_time: utcStartTime.toISOString(),
          end_time: utcEndTime.toISOString(),
          timezone: data.timezone,
          location: data.location,
          is_online: data.is_online,
          meeting_url: data.meeting_url,
          max_capacity: data.max_capacity,
          is_private: data.is_private,
          category: data.category,
          tags: data.tags,
        })
        .eq('id', event.id);

      if (error) throw error;

      // Invalidate queries to refresh the data
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['events', event.id] });
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating event:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-1">
          <EditEventForm
            event={event}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}