import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Lock, AtSign } from "lucide-react";
import type { Profile } from "@/types/profile";

interface ProfilePrivacyProps {
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
}

export function ProfilePrivacy({ profile, onProfileChange }: ProfilePrivacyProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <AtSign className="h-4 w-4" />
          Custom Username
        </label>
        <Input
          placeholder="Custom username"
          value={profile.custom_username || ""}
          onChange={(e) =>
            onProfileChange({ ...profile, custom_username: e.target.value })
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-medium flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Private Profile
          </label>
          <div className="text-sm text-muted-foreground">
            Only you can see your profile when private
          </div>
        </div>
        <Switch
          checked={!profile.is_public}
          onCheckedChange={(checked) =>
            onProfileChange({ ...profile, is_public: !checked })
          }
        />
      </div>
    </div>
  );
}