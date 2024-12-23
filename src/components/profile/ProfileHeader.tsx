import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VerificationBadge } from "@/components/profile/VerificationBadge";
import { MapPin } from "lucide-react";
import type { Profile } from "@/types/profile";

interface ProfileHeaderProps {
  profile: Profile;
  email?: string;
}

export function ProfileHeader({ profile, email }: ProfileHeaderProps) {
  return (
    <div className="relative">
      <div className="h-32 w-full bg-gradient-to-r from-blue-100 to-blue-50 rounded-t-lg" />
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row gap-4 -mt-12 sm:-mt-16">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background">
            <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
            <AvatarFallback>{profile.full_name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">{profile.full_name || "Anonymous"}</h1>
              <VerificationBadge 
                status={profile.verification_status} 
                badgeStyle={profile.badge_style}
              />
            </div>
            {profile.username && (
              <p className="text-muted-foreground">@{profile.username}</p>
            )}
            {profile.bio && (
              <p className="text-sm">{profile.bio}</p>
            )}
            <div className="flex items-center gap-4 flex-wrap">
              {profile.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              {email && (
                <span className="text-sm text-muted-foreground">{email}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}