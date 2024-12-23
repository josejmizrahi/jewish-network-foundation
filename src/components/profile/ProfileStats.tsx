import { Card, CardContent } from "@/components/ui/card";
import type { Profile } from "@/types/profile";

interface ProfileStatsProps {
  profile: Profile;
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
        <CardContent className="p-6">
          <div className="space-y-1">
            <div className="text-3xl font-light tracking-tight">{profile.points || 0}</div>
            <div className="text-xs font-medium text-muted-foreground">POINTS</div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
        <CardContent className="p-6">
          <div className="space-y-1">
            <div className="text-3xl font-light tracking-tight capitalize">
              {profile.role.replace('_', ' ')}
            </div>
            <div className="text-xs font-medium text-muted-foreground">ROLE</div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
        <CardContent className="p-6">
          <div className="space-y-1">
            <div className="text-3xl font-light tracking-tight">
              {new Date(profile.created_at).toLocaleDateString('en-US', { 
                month: 'short',
                year: 'numeric'
              })}
            </div>
            <div className="text-xs font-medium text-muted-foreground">JOINED</div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
        <CardContent className="p-6">
          <div className="space-y-1">
            <div className="text-3xl font-light tracking-tight capitalize">
              {profile.verification_status}
            </div>
            <div className="text-xs font-medium text-muted-foreground">STATUS</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}