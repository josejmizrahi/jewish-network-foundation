import { Home, User, Shield, Calendar, type LucideIcon } from "lucide-react";
import type { Profile } from "@/types/profile";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export function getNavItems(user: any | null, profile: Profile | null, pathname: string): NavItem[] {
  return [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    // Only show About section for non-authenticated users
    ...(!user ? [{
      title: "About",
      url: "/about",
      icon: Home,
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
      isActive: pathname.startsWith("/about") || 
                pathname === "/community" || 
                pathname === "/resources",
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
      isActive: pathname === "/profile" || pathname === "/settings",
    }] : []),
    // Show Events section for authenticated users
    ...(user ? [{
      title: "Events",
      url: "/events",
      icon: Calendar,
      isActive: pathname.startsWith("/events"),
    }] : []),
    // Only show Verification Management for admins
    ...(profile?.is_admin ? [{
      title: "Verification",
      url: "/verification-management",
      icon: Shield,
      isActive: pathname === "/verification-management",
    }] : []),
  ];
}