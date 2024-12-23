import { useState } from "react";
import { MainNav } from "@/components/layout/MainNav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { MembershipCard } from "@/components/profile/MembershipCard";
import { ProfileProgress } from "@/components/profile/ProfileProgress";
import { VerificationBadge } from "@/components/profile/VerificationBadge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Profile } from "@/types/profile";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<Profile | null>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      const profile = data as Profile;
      setProfileData(profile);
      return profile;
    },
    enabled: !!user?.id,
  });

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: async (updatedProfile: Profile) => {
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user?.id);

      if (error) throw error;
      return updatedProfile;
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating profile:', error);
    },
  });

  const handleProfileChange = (newProfile: Profile) => {
    setProfileData(newProfile);
  };

  const handleUpdateProfile = () => {
    if (profileData) {
      updateProfile(profileData);
    }
  };

  if (isLoading || !profile) {
    return (
      <SidebarProvider defaultOpen>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1">
            <MainNav />
            <SidebarInset>
              <div className="container mx-auto px-4 py-8">
                Loading...
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
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold">Profile</h1>
                  <VerificationBadge status={profile.verification_status} />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-6">
                    <ProfileForm
                      profile={profileData || profile}
                      updating={isUpdating}
                      onUpdateProfile={handleUpdateProfile}
                      onProfileChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-6">
                    <ProfileProgress profile={profile} />
                    <MembershipCard profile={profile} />
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Member Since</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(user?.created_at || '').toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}