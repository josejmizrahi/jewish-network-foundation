import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import type { Profile } from "@/types/profile";

interface ProfileBasicInfoProps {
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
}

export function ProfileBasicInfo({ profile, onProfileChange }: ProfileBasicInfoProps) {
  return (
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
    </div>
  );
}