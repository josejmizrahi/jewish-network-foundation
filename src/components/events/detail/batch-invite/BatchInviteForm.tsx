import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { BatchInviteFormFields } from "./BatchInviteFormFields";
import { batchInviteSchema, type BatchInviteFormValues } from "./types";

interface BatchInviteFormProps {
  onSubmit: (data: BatchInviteFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function BatchInviteForm({ onSubmit, isSubmitting, onCancel }: BatchInviteFormProps) {
  const form = useForm<BatchInviteFormValues>({
    resolver: zodResolver(batchInviteSchema),
    defaultValues: {
      emails: "",
      message: "",
      expirationDays: 7,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BatchInviteFormFields form={form} />
        
        <div className="flex justify-end gap-4">
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
            Send Invitations
          </Button>
        </div>
      </form>
    </Form>
  );
}