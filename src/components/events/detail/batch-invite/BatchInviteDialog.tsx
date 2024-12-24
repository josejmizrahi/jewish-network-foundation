import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users } from "lucide-react";
import { BatchInviteForm } from "./BatchInviteForm";
import { useBatchInvite } from "./useBatchInvite";

interface BatchInviteDialogProps {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BatchInviteDialog({ eventId, open, onOpenChange }: BatchInviteDialogProps) {
  const { isSubmitting, handleBatchInvite } = useBatchInvite(eventId);

  const handleSubmit = async (data: any) => {
    const success = await handleBatchInvite(data);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Batch Invite Members
          </DialogTitle>
        </DialogHeader>

        <BatchInviteForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}