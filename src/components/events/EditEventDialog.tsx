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
    luma_id?: string | null;
  };
}

export function EditEventDialog({ open, onOpenChange, event }: EditEventDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: EventFormValues) => {
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

      const updatedData = {
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
        cover_image: data.cover_image,
        category: data.category,
        tags: data.tags,
      };

      const { error } = await supabase
        .from('events')
        .update(updatedData)
        .eq('id', event.id);

      if (error) throw error;

      // Sync with Luma if event has Luma ID
      if (event.luma_id) {
        try {
          const { error: lumaError } = await supabase.functions.invoke('luma-api', {
            body: { 
              action: 'update',
              eventData: {
                ...updatedData,
                luma_id: event.luma_id,
              }
            }
          });

          if (lumaError) {
            console.error('Failed to sync with Luma:', lumaError);
            toast({
              title: "Warning",
              description: "Event updated but failed to sync with Luma. Please try syncing again later.",
              variant: "destructive",
            });
          }
        } catch (lumaError) {
          console.error('Luma sync error:', lumaError);
        }
      }

      toast({
        title: "Event updated",
        description: "Your event has been updated successfully.",
      });

      // Invalidate queries to refresh the data
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['events', event.id] });
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update event. Please try again.",
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
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-1">
          <EditEventForm
            initialData={event}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}