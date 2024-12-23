"use client"

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
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const navItems = [
    {
      title: "Home",
      url: "/",
      icon: SquareTerminal,
      isActive: true,
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}