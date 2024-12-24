import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsGeneral } from "./tabs/SettingsGeneral";
import { SettingsNotifications } from "./tabs/SettingsNotifications";
import { SettingsSecurity } from "./tabs/SettingsSecurity";
import type { Profile } from "@/types/profile";
import type { User } from "@supabase/supabase-js";

interface SettingsTabsProps {
  profileData: Profile;
  onUpdateSettings: (values: any) => void;
  onUpdateNotifications: (values: any) => void;
  onUpdatePassword: (values: any) => void;
  isUpdating: boolean;
  isUpdatingNotifications: boolean;
  isUpdatingPassword: boolean;
  error?: any;
  user?: User;
}

export function SettingsTabs({
  profileData,
  onUpdateSettings,
  onUpdateNotifications,
  onUpdatePassword,
  isUpdating,
  isUpdatingNotifications,
  isUpdatingPassword,
}: SettingsTabsProps) {
  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <SettingsGeneral
          profile={profileData}
          onSubmit={onUpdateSettings}
          isLoading={isUpdating}
        />
      </TabsContent>

      <TabsContent value="notifications">
        <SettingsNotifications
          onSubmit={onUpdateNotifications}
          isLoading={isUpdatingNotifications}
          defaultValues={{
            email_notifications: profileData.email_notifications || false,
            marketing_emails: profileData.marketing_emails || false,
            security_emails: profileData.security_emails || true,
          }}
        />
      </TabsContent>

      <TabsContent value="security">
        <SettingsSecurity
          onSubmit={onUpdatePassword}
          isLoading={isUpdatingPassword}
        />
      </TabsContent>
    </Tabs>
  );
}