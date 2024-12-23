import * as React from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "../context"
import { cn } from "@/lib/utils"

export interface SidebarTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarTriggerProps
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      ref={ref}
      className={cn("hover:bg-transparent", className)}
      {...props}
    >
      <Menu className="h-6 w-6" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"