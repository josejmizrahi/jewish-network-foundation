import { Sidebar, SidebarRail } from "@/components/ui/sidebar"
import { GalleryVerticalEnd } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useLocation } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { getNavItems } from "./sidebar/NavItems"
import { isProfile } from "@/types/profile"
import { SidebarHeader } from "./sidebar/SidebarHeader"
import { SidebarContent } from "./sidebar/SidebarContent"
import { SidebarFooter } from "./sidebar/SidebarFooter"
import { type Team } from "@/types/teams"
import { type UserData } from "@/types/user"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const location = useLocation();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      if (data && isProfile(data)) {
        return data;
      }
      throw new Error('Invalid profile data received');
    },
    enabled: !!user?.id,
  });

  const navItems = getNavItems(user, profile, location.pathname);

  const userData: UserData = {
    name: user?.user_metadata?.full_name || "User",
    email: user?.email || "",
    avatar: user?.user_metadata?.avatar_url || "",
  };

  const teams: Team[] = [
    {
      name: "JNS",
      logo: GalleryVerticalEnd,
      plan: "Community",
    }
  ];

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm" 
      {...props}
    >
      <SidebarHeader teams={teams} />
      <SidebarContent items={navItems} />
      <SidebarFooter user={userData} />
      <SidebarRail className="hover:bg-muted/50 transition-colors duration-200" />
    </Sidebar>
  );
}