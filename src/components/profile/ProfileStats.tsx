import { Card, CardContent } from "@/components/ui/card";
import type { Profile } from "@/types/profile";

interface ProfileStatsProps {
  profile: Profile;
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Card className="border-none bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="text-4xl font-light">{profile.points || 0}</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Points</div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-none bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="text-4xl font-light capitalize">
              {profile.role.replace('_', ' ')}
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-none bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="text-4xl font-light">
              {new Date(profile.created_at).toLocaleDateString('en-US', { 
                month: 'short',
                year: 'numeric'
              })}
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Joined</div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-none bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="text-4xl font-light capitalize">
              {profile.verification_status}
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}