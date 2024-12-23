import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationsForm } from "@/components/settings/NotificationsForm";

interface SettingsNotificationsProps {
  onSubmit: (values: any) => void;
  isLoading: boolean;
  defaultValues: {
    email_notifications: boolean;
    marketing_emails: boolean;
    security_emails: boolean;
  };
}

export function SettingsNotifications({
  onSubmit,
  isLoading,
  defaultValues,
}: SettingsNotificationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <NotificationsForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          defaultValues={defaultValues}
        />
      </CardContent>
    </Card>
  );
}