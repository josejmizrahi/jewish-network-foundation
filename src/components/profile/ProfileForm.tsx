import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, User, MapPin, Link, FileText } from "lucide-react";
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
      <h2 className="text-lg font-semibold">Edit Profile</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Username
          </label>
          <Input
            id="username"
            type="text"
            value={profile.username || ""}
            onChange={(e) =>
              onProfileChange({ ...profile, username: e.target.value })
            }
            placeholder="Enter your username"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Full Name
          </label>
          <Input
            id="fullName"
            type="text"
            value={profile.full_name || ""}
            onChange={(e) =>
              onProfileChange({ ...profile, full_name: e.target.value })
            }
            placeholder="Enter your full name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
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
          <label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </label>
          <Input
            id="location"
            type="text"
            value={profile.location || ""}
            onChange={(e) =>
              onProfileChange({ ...profile, location: e.target.value })
            }
            placeholder="Enter your location"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="avatarUrl" className="text-sm font-medium flex items-center gap-2">
            <Link className="h-4 w-4" />
            Avatar URL
          </label>
          <Input
            id="avatarUrl"
            type="text"
            value={profile.avatar_url || ""}
            onChange={(e) =>
              onProfileChange({ ...profile, avatar_url: e.target.value })
            }
            placeholder="Enter your avatar URL"
          />
        </div>
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