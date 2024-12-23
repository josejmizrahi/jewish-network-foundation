import { MainNav } from "@/components/layout/MainNav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Profile } from "@/types/profile";
import type { VerificationStatus, UserRole } from "@/types/verification";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('No profile found');
      }

      const typedProfile: Profile = {
        ...data,
        verification_status: (data.verification_status || 'pending') as VerificationStatus,
        role: (data.role || 'basic_member') as UserRole,
        email_notifications: data.email_notifications || false,
        marketing_emails: data.marketing_emails || false,
        security_emails: data.security_emails || true,
        social_links: data.social_links || {},
        is_public: data.is_public ?? true,
        is_admin: data.is_admin || false
      };
      
      setProfile(typedProfile);
      return typedProfile;
    },
    enabled: !!user?.id,
  });

  const { mutate: updateSettings, isPending: isUpdating } = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: values.display_name,
          bio: values.bio,
          email_notifications: values.email_notifications,
          marketing_emails: values.marketing_emails,
          security_emails: values.security_emails
        })
        .eq('id', user?.id);

      if (error) throw error;
      return values;
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating settings:', error);
    },
  });

  const { mutate: updateNotifications, isPending: isUpdatingNotifications } = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          email_notifications: values.email_notifications,
          marketing_emails: values.marketing_emails,
          security_emails: values.security_emails,
        })
        .eq('id', user?.id);

      if (error) throw error;
      return values;
    },
    onSuccess: () => {
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update notification preferences. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating notification preferences:', error);
    },
  });

  const { mutate: updatePassword, isPending: isUpdatingPassword } = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase.auth.updateUser({
        password: values.new_password
      });

      if (error) throw error;
      return values;
    },
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating password:', error);
    },
  });

  if (isLoading || !profileData) {
    return (
      <SidebarProvider defaultOpen>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1">
            <MainNav />
            <SidebarInset>
              <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              </div>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <MainNav />
          <SidebarInset>
            <div className="container mx-auto px-4 py-8">
              <div className="space-y-6">
                <SettingsHeader />
                <SettingsTabs
                  profileData={profileData}
                  onUpdateSettings={updateSettings}
                  onUpdateNotifications={updateNotifications}
                  onUpdatePassword={updatePassword}
                  isUpdating={isUpdating}
                  isUpdatingNotifications={isUpdatingNotifications}
                  isUpdatingPassword={isUpdatingPassword}
                />
              </div>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}