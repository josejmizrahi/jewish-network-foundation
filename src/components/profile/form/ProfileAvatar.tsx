import { ProfileImageUpload } from "@/components/profile/ProfileImageUpload";
import type { Profile } from "@/types/profile";

interface ProfileAvatarProps {
  profile: Profile;
  onAvatarChange: (url: string) => void;
}

export function ProfileAvatar({ profile, onAvatarChange }: ProfileAvatarProps) {
  return (
    <ProfileImageUpload
      avatarUrl={profile.avatar_url}
      fullName={profile.full_name}
      userId={profile.id}
      onUploadComplete={onAvatarChange}
    />
  );
}