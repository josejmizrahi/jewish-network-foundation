import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { MainNav } from "@/components/layout/MainNav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Profile {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  verification_status: 'pending' | 'verified' | 'rejected';
  role: 'basic_member' | 'verified_member' | 'leader';
  points: number;
}

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    username: "",
    full_name: "",
    avatar_url: "",
    bio: "",
    location: "",
    verification_status: 'pending',
    role: 'basic_member',
    points: 0
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    getProfile();
  }, [user, navigate]);

  async function getProfile() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      if (data) setProfile(data as Profile);
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          username: profile.username,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          bio: profile.bio,
          location: profile.location,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile Settings</CardTitle>
                <VerificationBadge status={profile.verification_status} />
              </div>
              <CardDescription>
                Update your profile information and manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={profile.username || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, username: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={profile.full_name || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, full_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </label>
                <Textarea
                  id="bio"
                  value={profile.bio || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location
                </label>
                <Input
                  id="location"
                  type="text"
                  value={profile.location || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="avatarUrl" className="text-sm font-medium">
                  Avatar URL
                </label>
                <Input
                  id="avatarUrl"
                  type="text"
                  value={profile.avatar_url || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, avatar_url: e.target.value })
                  }
                />
              </div>
              <Button
                onClick={updateProfile}
                disabled={updating}
                className="w-full"
              >
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Membership Status</CardTitle>
                <CardDescription>
                  Your current role and verification status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">Role</div>
                    <Badge variant="outline" className="mt-1">
                      {profile.role.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Points</div>
                    <div className="mt-1 text-2xl font-bold">{profile.points}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function VerificationBadge({ status }: { status: Profile['verification_status'] }) {
  switch (status) {
    case 'verified':
      return (
        <Badge className="bg-green-500">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Verified
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="destructive">
          <AlertCircle className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary">
          <Loader2 className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
  }
}