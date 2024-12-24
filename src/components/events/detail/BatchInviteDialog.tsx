import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const batchInviteSchema = z.object({
  emails: z.string().min(1, "Please enter at least one email"),
  message: z.string().optional(),
  expirationDays: z.number().min(1).max(30).default(7),
});

interface BatchInviteDialogProps {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BatchInviteDialog({ eventId, open, onOpenChange }: BatchInviteDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof batchInviteSchema>>({
    resolver: zodResolver(batchInviteSchema),
    defaultValues: {
      emails: "",
      message: "",
      expirationDays: 7,
    },
  });

  const onSubmit = async (data: z.infer<typeof batchInviteSchema>) => {
    setIsSubmitting(true);
    try {
      const emails = data.emails.split(/[\n,]/).map(email => email.trim()).filter(Boolean);
      
      // Create batch
      const { data: batch, error: batchError } = await supabase
        .from('event_invitation_batches')
        .insert({
          event_id: eventId,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          email_template: data.message,
          total_invitations: emails.length,
        })
        .select()
        .single();

      if (batchError) throw batchError;

      // Get profiles for existing users
      const { data: existingProfiles } = await supabase
        .from('profiles')
        .select('id')
        .in('email', emails);

      const existingUserIds = existingProfiles?.map(p => p.id) || [];

      // Calculate expiration date
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + data.expirationDays);

      // Create invitations
      if (existingUserIds.length > 0) {
        const { error: inviteError } = await supabase
          .from('event_invitations')
          .insert(
            existingUserIds.map(userId => ({
              event_id: eventId,
              inviter_id: (await supabase.auth.getUser()).data.user?.id,
              invitee_id: userId,
              batch_id: batch.id,
              expiration_date: expirationDate.toISOString(),
            }))
          );

        if (inviteError) throw inviteError;
      }

      // Update batch status
      await supabase
        .from('event_invitation_batches')
        .update({
          sent_invitations: existingUserIds.length,
          failed_invitations: emails.length - existingUserIds.length,
          status: 'completed',
        })
        .eq('id', batch.id);

      toast({
        title: "Invitations sent",
        description: `Successfully sent ${existingUserIds.length} invitations.`,
      });
      
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send invitations.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="emails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Addresses</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter email addresses (one per line or comma-separated)"
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter multiple email addresses, separated by commas or new lines
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a personal message to the invitation"
                      className="h-24"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expirationDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invitation Expiration (Days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Invitations will expire after this many days
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
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
                Send Invitations
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}