import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Welcome!</DialogTitle>
        <DialogDescription>
          Let's get your profile set up. This will only take a few minutes.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end">
        <Button onClick={onNext}>
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}