"use client"

import * as React from "react"
import {
  BookOpen,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "JNS",
      logo: GalleryVerticalEnd,
      plan: "Community",
    }
  ],
  navMain: [
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
      title: "Settings",
      url: "/profile",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "/profile",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}