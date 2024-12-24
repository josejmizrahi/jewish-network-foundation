import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import { EditEventForm } from "./edit/EditEventForm";
import type { EventFormValues, EventCategory } from "./schemas/eventFormSchema";

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
      const formattedData = {
        ...data,
        start_time: data.start_time.toISOString(),
        end_time: data.end_time.toISOString(),
        timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      const { error } = await supabase
        .from('events')
        .update(formattedData)
        .eq('id', event.id);

      if (error) throw error;

      toast({
        title: "Event updated",
        description: "Your event has been updated successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', event.id] });
      
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