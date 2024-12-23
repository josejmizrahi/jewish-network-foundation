import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/types/profile";

interface ProfileProgressProps {
  profile: Profile;
}

export function ProfileProgress({ profile }: ProfileProgressProps) {
  const calculateProgress = () => {
    const fields = [
      profile.username,
      profile.full_name,
      profile.avatar_url,
      profile.bio,
      profile.location
    ];
    const completedFields = fields.filter(field => field !== null && field !== "").length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const progress = calculateProgress();

  if (progress === 100) {
    return null;
  }

  return (
    <Card className="border-none bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">Profile Completion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="text-sm text-muted-foreground">
            {progress}% Complete
          </div>
        </div>
        <ul className="text-sm space-y-2 text-muted-foreground">
          {!profile.username && (
            <li>• Add a username</li>
          )}
          {!profile.full_name && (
            <li>• Add your full name</li>
          )}
          {!profile.avatar_url && (
            <li>• Upload a profile picture</li>
          )}
          {!profile.bio && (
            <li>• Write a short bio</li>
          )}
          {!profile.location && (
            <li>• Add your location</li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}