import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Link, useLocation } from "react-router-dom"
import { type NavItem } from "@/types/nav"

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  const location = useLocation();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive || location.pathname.startsWith(item.url)}
          >
            <SidebarMenuItem>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      tooltip={item.title}
                      isActive={location.pathname === item.url || 
                              item.items?.some(subItem => location.pathname === subItem.url)}
                      className="transition-colors duration-200 hover:bg-accent/80 w-full"
                    >
                      <Link to={item.url} className="flex items-center gap-2 w-full group-data-[collapsible=icon]:justify-center">
                        <item.icon className="h-4 w-4 transition-transform duration-200 group-data-[collapsible=icon]:mx-auto" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto mr-2 group-data-[collapsible=icon]:hidden">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90 group-data-[collapsible=icon]:hidden" />
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="animate-accordion-down">
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <Link 
                            to={subItem.url}
                            className="w-full"
                          >
                            <SidebarMenuSubButton 
                              isActive={location.pathname === subItem.url}
                              className="transition-colors duration-200 hover:bg-accent/80"
                            >
                              <span>{subItem.title}</span>
                              {subItem.badge && (
                                <Badge variant="secondary" className="ml-auto">
                                  {subItem.badge}
                                </Badge>
                              )}
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <SidebarMenuButton 
                  tooltip={item.title} 
                  isActive={location.pathname === item.url}
                  className="transition-colors duration-200 hover:bg-accent/80 w-full"
                >
                  <Link 
                    to={item.url}
                    className="flex items-center gap-2 w-full group-data-[collapsible=icon]:justify-center"
                  >
                    <item.icon className="h-4 w-4 transition-transform duration-200 group-data-[collapsible=icon]:mx-auto" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto group-data-[collapsible=icon]:hidden">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}