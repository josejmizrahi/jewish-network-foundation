import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getNavItems } from "./sidebar/NavItems";
import { isProfile } from "@/types/profile";

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

  const userData = {
    name: user?.user_metadata?.full_name || "User",
    email: user?.email || "",
    avatar: user?.user_metadata?.avatar_url || "",
  };

  const teams = [
    {
      name: "JNS",
      logo: GalleryVerticalEnd,
      plan: "Community",
    }
  ];

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" 
      {...props}
    >
      <SidebarHeader className="h-14 border-b px-4 flex items-center">
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent className="flex flex-col flex-grow p-4 space-y-6">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail className="hover:bg-muted/50 transition-colors duration-200" />
    </Sidebar>
  );
}