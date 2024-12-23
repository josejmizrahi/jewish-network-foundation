import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AppealFormProps {
  verificationRequestId: string;
  onAppealSubmitted: () => void;
}

export function AppealForm({ verificationRequestId, onAppealSubmitted }: AppealFormProps) {
  const [appealText, setAppealText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!appealText.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for your appeal",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("verification_requests")
        .update({
          status: "pending",
          reviewer_notes: `Appeal: ${appealText}`,
          reviewed_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", verificationRequestId);

      if (error) throw error;

      toast({
        title: "Appeal Submitted",
        description: "Your verification appeal has been submitted for review.",
      });

      onAppealSubmitted();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit appeal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appeal Verification Decision</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Please explain why you believe your verification request should be reconsidered
          </label>
          <Textarea
            value={appealText}
            onChange={(e) => setAppealText(e.target.value)}
            placeholder="Provide additional context or information to support your appeal..."
            rows={4}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Appeal
        </Button>
      </CardContent>
    </Card>
  );
}