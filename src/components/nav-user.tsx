import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function NavUser({ user }: NavUserProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={user.name}
        className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200 group"
      >
        <Link to="/profile" className="w-full flex items-center gap-4 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-9 w-9 border ring-2 ring-background transition-shadow duration-200 group-hover:ring-accent/20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary">{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
            <span className="font-medium leading-none">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}