import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";

interface CompleteStepProps {
  onBack: () => void;
  onComplete: () => void;
}

export function CompleteStep({ onBack, onComplete }: CompleteStepProps) {
  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>All Set!</DialogTitle>
        <DialogDescription>
          Your profile is ready to go. You can always update your information later from your profile page.
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-center justify-center py-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onComplete}>
          Complete Profile
          <CheckCircle className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}