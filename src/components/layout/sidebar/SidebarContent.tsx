import { SidebarContent as Content } from "@/components/ui/sidebar"
import { NavMain } from "@/components/nav-main"
import { type NavItem } from "@/types/nav"

interface SidebarContentProps {
  items: NavItem[];
}

export function SidebarContent({ items }: SidebarContentProps) {
  return (
    <Content className="flex flex-col flex-grow px-6 py-4 space-y-6 group-data-[collapsible=icon]:px-2">
      <NavMain items={items} />
    </Content>
  );
}