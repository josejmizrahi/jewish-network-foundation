import { useState } from "react";
import { MainNav } from "@/components/layout/MainNav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { MembershipCard } from "@/components/profile/MembershipCard";
import { ProfileProgress } from "@/components/profile/ProfileProgress";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { VerificationRequestForm } from "@/components/verification/VerificationRequestForm";
import { VerificationHistory } from "@/components/verification/VerificationHistory";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Profile } from "@/types/profile";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);

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
      setIsDialogOpen(false);
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
                  <div className="flex gap-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>Edit Profile</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>
                        <ProfileForm
                          profile={profileData || profile}
                          updating={isUpdating}
                          onUpdateProfile={handleUpdateProfile}
                          onProfileChange={handleProfileChange}
                        />
                      </DialogContent>
                    </Dialog>
                    {profile.verification_status !== "verified" && (
                      <Dialog
                        open={showVerificationForm}
                        onOpenChange={setShowVerificationForm}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline">Request Verification</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Verification Request</DialogTitle>
                          </DialogHeader>
                          <VerificationRequestForm
                            userId={profile.id}
                            onRequestSubmitted={() => setShowVerificationForm(false)}
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
                <div className="space-y-6">
                  <ProfileHeader profile={profile} email={user?.email} />
                  <ProfileStats profile={profile} />
                  <div className="grid gap-6 md:grid-cols-2">
                    <ProfileProgress profile={profile} />
                    <MembershipCard profile={profile} />
                  </div>
                  <VerificationHistory />
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}