import * as React from "react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom"

interface NavUserProps {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function NavUser({ user }: NavUserProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={user.name}
          className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200 group"
        >
          <Link to="/profile" className="w-full flex items-center gap-4">
            <Avatar className="h-9 w-9 border ring-2 ring-background transition-shadow duration-200 group-hover:ring-accent/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary">{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium leading-none">{user.name}</span>
              <span className="text-xs leading-none text-muted-foreground mt-1.5">
                {user.email}
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}