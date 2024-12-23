import * as React from "react"
import { LucideIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TeamSwitcherProps {
  teams: {
    name: string
    logo: LucideIcon
    plan: string
  }[]
}

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
  const [selectedTeam, setSelectedTeam] = React.useState(teams[0].name)

  return (
    <Select value={selectedTeam} onValueChange={setSelectedTeam}>
      <SelectTrigger className="w-full">
        <SelectValue>{selectedTeam}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {teams.map((team) => (
          <SelectItem key={team.name} value={team.name}>
            <div className="flex items-center gap-2">
              <team.logo className="h-4 w-4" />
              <span>{team.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {team.plan}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}