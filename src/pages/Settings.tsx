import { MainNav } from "@/components/layout/MainNav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { BottomNav } from "@/components/nav/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile-settings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleUpdateSettings = async (settings: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(settings)
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Settings updated",
        description: "Your settings have been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateNotifications = async (settings: any) => {
    await handleUpdateSettings(settings);
  };

  const handleUpdatePassword = async (data: { password: string }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading || !profileData) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full overflow-x-hidden">
        <AppSidebar />
        <div className="flex-1 min-w-0">
          <MainNav />
          <SidebarInset>
            <div className="container max-w-4xl mx-auto px-4 py-8">
              <SettingsHeader />
              <SettingsTabs 
                profileData={profileData}
                onUpdateSettings={handleUpdateSettings}
                onUpdateNotifications={handleUpdateNotifications}
                onUpdatePassword={handleUpdatePassword}
                isLoading={isLoading}
                error={null}
                user={user}
              />
            </div>
          </SidebarInset>
          <BottomNav />
        </div>
      </div>
    </SidebarProvider>
  );
}