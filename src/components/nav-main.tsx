import { ChevronRight, type LucideIcon } from "lucide-react"
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
import { Link, useLocation } from "react-router-dom"

interface NavMainProps {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}

export function NavMain({ items }: NavMainProps) {
  const location = useLocation();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-2">Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive || location.pathname.startsWith(item.url)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <Link to={item.url} className="w-full">
                      <SidebarMenuButton 
                        tooltip={item.title}
                        isActive={location.pathname === item.url || 
                                item.items?.some(subItem => location.pathname === subItem.url)}
                        className="transition-colors duration-200 hover:bg-accent/80"
                      >
                        <item.icon className="h-4 w-4 transition-transform duration-200" />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </Link>
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
                              {subItem.title}
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <Link 
                  to={item.url}
                  className="w-full"
                >
                  <SidebarMenuButton 
                    tooltip={item.title} 
                    isActive={location.pathname === item.url}
                    className="transition-colors duration-200 hover:bg-accent/80"
                  >
                    <item.icon className="h-4 w-4 transition-transform duration-200" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}