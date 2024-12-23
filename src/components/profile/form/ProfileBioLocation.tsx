import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, MapPin } from "lucide-react";
import type { Profile } from "@/types/profile";

interface ProfileBioLocationProps {
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
}

export function ProfileBioLocation({ profile, onProfileChange }: ProfileBioLocationProps) {
  return (
    <div className="space-y-4">
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
    </div>
  );
}