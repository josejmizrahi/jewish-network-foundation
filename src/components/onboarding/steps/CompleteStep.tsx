import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Rocket } from "lucide-react";

interface CompleteStepProps {
  onBack: () => void;
  onComplete: () => void;
}

export function CompleteStep({ onBack, onComplete }: CompleteStepProps) {
  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-2xl">You're All Set! 🎉</DialogTitle>
        <DialogDescription className="text-base">
          Your profile is ready to go. You can always update your information later from your profile page.
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-center justify-center py-6">
        <Rocket className="h-16 w-16 text-primary animate-bounce" />
      </div>
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>What's next?</p>
        <ul className="list-disc pl-4 space-y-2">
          <li>Explore the community</li>
          <li>Connect with others</li>
          <li>Share your thoughts</li>
        </ul>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onComplete} size="lg">
          Let's Go!
          <Rocket className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}