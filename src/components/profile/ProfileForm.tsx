import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProfileAvatar } from "./form/ProfileAvatar";
import { ProfileBasicInfo } from "./form/ProfileBasicInfo";
import { ProfileBioLocation } from "./form/ProfileBioLocation";
import { ProfileSocialLinks } from "./form/ProfileSocialLinks";
import { ProfilePrivacy } from "./form/ProfilePrivacy";
import type { Profile } from "@/types/profile";

interface ProfileFormProps {
  profile: Profile;
  updating: boolean;
  onUpdateProfile: () => void;
  onProfileChange: (profile: Profile) => void;
}

export function ProfileForm({ profile, updating, onUpdateProfile, onProfileChange }: ProfileFormProps) {
  const handleAvatarUpload = (url: string) => {
    onProfileChange({ ...profile, avatar_url: url });
  };

  return (
    <div className="space-y-6">
      <ProfileAvatar 
        profile={profile}
        onAvatarChange={handleAvatarUpload}
      />
      <ProfileBasicInfo 
        profile={profile}
        onProfileChange={onProfileChange}
      />
      <ProfileBioLocation 
        profile={profile}
        onProfileChange={onProfileChange}
      />
      <ProfileSocialLinks
        profile={profile}
        onProfileChange={onProfileChange}
      />
      <ProfilePrivacy
        profile={profile}
        onProfileChange={onProfileChange}
      />
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