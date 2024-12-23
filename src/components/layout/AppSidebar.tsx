import * as React from "react"
import {
  BookOpen,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
  User,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"
import { useLocation } from "react-router-dom"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      title: "Home",
      url: "/",
      icon: SquareTerminal,
      isActive: location.pathname === "/",
    },
    {
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
    },
    {
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
    },
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
    <Sidebar collapsible="icon" className="border-r" {...props}>
      <SidebarHeader className="h-14 border-b px-2">
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}