import { type LucideIcon } from "lucide-react"

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  badge?: number;
  items?: {
    title: string;
    url: string;
    badge?: number;
  }[];
}