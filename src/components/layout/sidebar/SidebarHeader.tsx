import { SidebarHeader as Header } from "@/components/ui/sidebar"
import { TeamSwitcher } from "@/components/team-switcher"
import { type Team } from "@/types/teams"

interface SidebarHeaderProps {
  teams: Team[];
}

export function SidebarHeader({ teams }: SidebarHeaderProps) {
  return (
    <Header className="h-16 border-b px-6 flex items-center group-data-[collapsible=icon]:px-2">
      <TeamSwitcher teams={teams} />
    </Header>
  );
}