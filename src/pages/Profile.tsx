import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { MainNav } from "@/components/layout/MainNav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Profile {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
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
        .select("username, full_name, avatar_url")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      if (data) setProfile(data);
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
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
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
      </main>
      <Footer />
    </div>
  );
}