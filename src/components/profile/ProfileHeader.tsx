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
    <div className="relative bg-background">
      <div className="h-48 w-full bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg" />
      <div className="px-8 pb-8">
        <div className="flex flex-col sm:flex-row gap-6 -mt-16 sm:-mt-20">
          <Avatar className="h-32 w-32 sm:h-40 sm:w-40 border-4 border-background shadow-xl">
            <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
            <AvatarFallback>{profile.full_name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight">{profile.full_name || "Anonymous"}</h1>
              <VerificationBadge 
                status={profile.verification_status} 
                badgeStyle={profile.badge_style}
              />
            </div>
            {profile.username && (
              <p className="text-muted-foreground text-lg">@{profile.username}</p>
            )}
            {profile.bio && (
              <p className="text-base leading-relaxed max-w-2xl">{profile.bio}</p>
            )}
            <div className="flex items-center gap-6 flex-wrap text-muted-foreground">
              {profile.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              {email && (
                <span>{email}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}