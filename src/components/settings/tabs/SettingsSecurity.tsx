import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SecurityForm } from "@/components/settings/SecurityForm";

interface SettingsSecurityProps {
  onSubmit: (values: any) => void;
  isLoading: boolean;
}

export function SettingsSecurity({ onSubmit, isLoading }: SettingsSecurityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <SecurityForm
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}