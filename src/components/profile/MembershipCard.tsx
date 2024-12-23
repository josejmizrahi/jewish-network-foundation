import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Profile } from "@/types/profile";

interface MembershipCardProps {
  profile: Profile;
}

export function MembershipCard({ profile }: MembershipCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership Status</CardTitle>
        <CardDescription>
          Your current role and verification status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium">Role</div>
            <Badge variant="outline" className="mt-1">
              {profile.role.replace('_', ' ')}
            </Badge>
          </div>
          <div>
            <div className="text-sm font-medium">Points</div>
            <div className="mt-1 text-2xl font-bold">{profile.points}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}