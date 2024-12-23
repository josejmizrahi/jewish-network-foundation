import { Card, CardContent } from "@/components/ui/card";
import type { Profile } from "@/types/profile";

interface ProfileStatsProps {
  profile: Profile;
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold">{profile.points || 0}</div>
          <div className="text-xs text-muted-foreground">POINTS</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold capitalize">{profile.role.replace('_', ' ')}</div>
          <div className="text-xs text-muted-foreground">ROLE</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold">
            {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
          <div className="text-xs text-muted-foreground">JOINED</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold capitalize">{profile.verification_status}</div>
          <div className="text-xs text-muted-foreground">STATUS</div>
        </CardContent>
      </Card>
    </div>
  );
}