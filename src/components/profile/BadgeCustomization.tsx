import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Shield, ShieldCheck, BadgeCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/profile";

interface BadgeCustomizationProps {
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
}

const badgeStyles = [
  {
    id: "default",
    icon: BadgeCheck,
    label: "Default",
    className: "bg-primary",
  },
  {
    id: "shield",
    icon: Shield,
    label: "Shield",
    className: "bg-blue-500",
  },
  {
    id: "check",
    icon: CheckCircle2,
    label: "Checkmark",
    className: "bg-green-500",
  },
  {
    id: "secure",
    icon: ShieldCheck,
    label: "Secure",
    className: "bg-purple-500",
  },
];

export function BadgeCustomization({ profile, onProfileChange }: BadgeCustomizationProps) {
  const [selectedStyle, setSelectedStyle] = useState(
    profile.badge_style || "default"
  );
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);

  const handleStyleChange = async (value: string) => {
    setSelectedStyle(value);
    setUpdating(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ badge_style: value })
        .eq("id", profile.id);

      if (error) throw error;

      onProfileChange({ ...profile, badge_style: value });
      
      toast({
        title: "Success",
        description: "Badge style updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update badge style",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  // Only show for verified users
  if (profile.verification_status !== "verified") {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Badge Style</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4">
          {badgeStyles.map((style) => {
            const Icon = style.icon;
            return (
              <Badge
                key={style.id}
                variant="default"
                className={`${style.className} cursor-pointer transition-all ${
                  selectedStyle === style.id
                    ? "ring-2 ring-offset-2 ring-primary"
                    : ""
                }`}
                onClick={() => handleStyleChange(style.id)}
              >
                <Icon className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            );
          })}
        </div>
        <div className="text-sm text-muted-foreground">
          Choose how your verification badge appears on your profile
        </div>
      </CardContent>
    </Card>
  );
}