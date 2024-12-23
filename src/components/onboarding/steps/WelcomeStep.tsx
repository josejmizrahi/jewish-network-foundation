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
        <DialogTitle className="text-2xl">Welcome to the Community! 👋</DialogTitle>
        <DialogDescription className="text-base">
          Let's set up your profile together. This will only take a few minutes and will help you get the most out of your experience.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>We'll help you:</p>
        <ul className="list-disc pl-4 space-y-2">
          <li>Create your profile</li>
          <li>Set up your bio and location</li>
          <li>Customize your appearance</li>
        </ul>
      </div>
      <div className="flex justify-end">
        <Button onClick={onNext} size="lg">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}