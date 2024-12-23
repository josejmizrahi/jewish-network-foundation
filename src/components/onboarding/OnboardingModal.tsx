import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { WelcomeStep } from "./steps/WelcomeStep";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { BioStep } from "./steps/BioStep";
import { CompleteStep } from "./steps/CompleteStep";

const steps = ["welcome", "basic-info", "bio", "complete"];

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState("welcome");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("profile_completed, onboarding_step")
          .eq("id", session.user.id)
          .single();

        if (profile && !profile.profile_completed) {
          setCurrentStep(profile.onboarding_step);
          setOpen(true);
          // Calculate initial progress
          const currentIndex = steps.indexOf(profile.onboarding_step);
          setProgress((currentIndex / (steps.length - 1)) * 100);
        }
      }
    };

    checkOnboardingStatus();
  }, []);

  const updateStep = async (newStep: string) => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ onboarding_step: newStep })
      .eq("id", (await supabase.auth.getSession()).data.session?.user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    } else {
      setCurrentStep(newStep);
      // Update progress bar
      const newIndex = steps.indexOf(newStep);
      setProgress((newIndex / (steps.length - 1)) * 100);
    }
    setLoading(false);
  };

  const completeOnboarding = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ profile_completed: true })
      .eq("id", (await supabase.auth.getSession()).data.session?.user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to complete onboarding",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome aboard!",
        description: "Your profile is now complete.",
      });
      setOpen(false);
      navigate("/profile");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Profile completion: {Math.round(progress)}%
          </p>
        </div>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        {currentStep === "welcome" && (
          <WelcomeStep onNext={() => updateStep("basic-info")} />
        )}
        {currentStep === "basic-info" && (
          <BasicInfoStep
            onBack={() => updateStep("welcome")}
            onNext={() => updateStep("bio")}
          />
        )}
        {currentStep === "bio" && (
          <BioStep
            onBack={() => updateStep("basic-info")}
            onNext={() => updateStep("complete")}
          />
        )}
        {currentStep === "complete" && (
          <CompleteStep
            onBack={() => updateStep("bio")}
            onComplete={completeOnboarding}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}