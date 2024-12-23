import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Profile } from "@/types/profile";

interface MembershipCardProps {
  profile: Profile;
}

export function MembershipCard({ profile }: MembershipCardProps) {
  return (
    <Card className="border-none bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">Membership Status</CardTitle>
        <CardDescription className="text-base">
          Your current role and verification status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="text-sm font-medium mb-2.5">Role</div>
            <Badge variant="secondary" className="text-sm">
              {profile.role.replace('_', ' ')}
            </Badge>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Points</div>
            <div className="text-3xl font-light tracking-tight">{profile.points}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}