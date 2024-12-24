import { useState } from "react";
import { MainNav } from "@/components/layout/MainNav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { BottomNav } from "@/components/nav/BottomNav";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isVerificationStatus } from "@/types/verification";
import type { Profile } from "@/types/profile";
import { useToast } from "@/components/ui/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      // Ensure verification_status is valid
      if (data && !isVerificationStatus(data.verification_status)) {
        data.verification_status = 'pending'; // Default to pending if invalid
      }

      return data as Profile;
    },
    enabled: !!user,
  });

  const handleUpdateProfile = async (updatedProfile: Profile) => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user?.id);

      if (error) throw error;

      await refetch(); // Refresh the profile data
      setIsEditing(false); // Close the form after successful update
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
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
              <div className="space-y-8">
                <ProfileHeader profile={profile} />
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <ProfileForm 
                    profile={profile}
                    updating={updating}
                    onUpdateProfile={() => handleUpdateProfile(profile)}
                    onProfileChange={(updatedProfile) => handleUpdateProfile(updatedProfile)}
                  />
                )}
              </div>
            </div>
          </SidebarInset>
          <BottomNav />
        </div>
      </div>
    </SidebarProvider>
  );
}