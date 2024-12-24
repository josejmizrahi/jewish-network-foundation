import { MainNav } from "@/components/layout/MainNav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { BottomNav } from "@/components/nav/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Profile() {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
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

  const handleUpdateProfile = async (updatedProfile: any) => {
    const { error } = await supabase
      .from('profiles')
      .update(updatedProfile)
      .eq('id', user?.id);

    if (error) throw error;
  };

  if (isLoading || !profile) {
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
              <ProfileHeader profile={profile} />
              <ProfileForm 
                profile={profile}
                updating={false}
                onUpdateProfile={handleUpdateProfile}
                onProfileChange={() => {}}
              />
            </div>
          </SidebarInset>
          <BottomNav />
        </div>
      </div>
    </SidebarProvider>
  );
}