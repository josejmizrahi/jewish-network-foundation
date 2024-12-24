import { SidebarFooter as Footer } from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import { type UserData } from "@/types/user"

interface SidebarFooterProps {
  user: UserData;
}

export function SidebarFooter({ user }: SidebarFooterProps) {
  return (
    <Footer className="border-t px-6 py-4 group-data-[collapsible=icon]:px-2">
      <NavUser user={user} />
    </Footer>
  );
}