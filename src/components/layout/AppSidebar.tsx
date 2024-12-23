"use client"

import * as React from "react"
import {
  BookOpen,
  GalleryVerticalEnd,
  Home,
  User,
  Shield,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"
import { useLocation } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

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
      return data;
    },
    enabled: !!user?.id,
  });

  const navItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: location.pathname === "/",
    },
    // Only show About section for non-authenticated users
    ...(!user ? [{
      title: "About",
      url: "/about",
      icon: BookOpen,
      items: [
        {
          title: "Community",
          url: "/community",
        },
        {
          title: "Resources",
          url: "/resources",
        },
      ],
      isActive: location.pathname.startsWith("/about") || 
                location.pathname === "/community" || 
                location.pathname === "/resources",
    }] : []),
    // Only show Profile section for authenticated users
    ...(user ? [{
      title: "Profile",
      url: "/profile",
      icon: User,
      items: [
        {
          title: "Settings",
          url: "/settings",
        },
      ],
      isActive: location.pathname === "/profile" || location.pathname === "/settings",
    }] : []),
    // Only show Verification Management for admins
    ...(profile?.is_admin ? [{
      title: "Verification",
      url: "/verification-management",
      icon: Shield,
      isActive: location.pathname === "/verification-management",
    }] : []),
  ];

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
    <Sidebar collapsible="icon" className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" {...props}>
      <SidebarHeader className="h-14 border-b px-2">
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}