import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Profile } from "@/types/profile";

interface ProfileFormProps {
  profile: Profile;
  updating: boolean;
  onUpdateProfile: () => void;
  onProfileChange: (profile: Profile) => void;
}

export function ProfileForm({ profile, updating, onUpdateProfile, onProfileChange }: ProfileFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <Input
          id="username"
          type="text"
          value={profile.username || ""}
          onChange={(e) =>
            onProfileChange({ ...profile, username: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium">
          Full Name
        </label>
        <Input
          id="fullName"
          type="text"
          value={profile.full_name || ""}
          onChange={(e) =>
            onProfileChange({ ...profile, full_name: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">
          Bio
        </label>
        <Textarea
          id="bio"
          value={profile.bio || ""}
          onChange={(e) =>
            onProfileChange({ ...profile, bio: e.target.value })
          }
          placeholder="Tell us about yourself..."
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="location" className="text-sm font-medium">
          Location
        </label>
        <Input
          id="location"
          type="text"
          value={profile.location || ""}
          onChange={(e) =>
            onProfileChange({ ...profile, location: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="avatarUrl" className="text-sm font-medium">
          Avatar URL
        </label>
        <Input
          id="avatarUrl"
          type="text"
          value={profile.avatar_url || ""}
          onChange={(e) =>
            onProfileChange({ ...profile, avatar_url: e.target.value })
          }
        />
      </div>
      <Button
        onClick={onUpdateProfile}
        disabled={updating}
        className="w-full"
      >
        {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </div>
  );
}