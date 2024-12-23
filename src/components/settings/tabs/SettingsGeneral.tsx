import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "@/components/settings/SettingsForm";
import type { Profile } from "@/types/profile";

interface SettingsGeneralProps {
  profile: Profile;
  onSubmit: (values: any) => void;
  isLoading: boolean;
}

export function SettingsGeneral({ profile, onSubmit, isLoading }: SettingsGeneralProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <SettingsForm
          profile={profile}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}