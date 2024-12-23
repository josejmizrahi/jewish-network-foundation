import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-base"

export const SidebarRail = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <div
      ref={ref}
      data-sidebar="rail"
      className={cn(
        "absolute inset-y-0 right-0 z-20 w-1 cursor-col-resize bg-transparent transition-colors hover:bg-accent active:bg-accent group-data-[collapsible=icon]:hidden",
        className
      )}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleSidebar()
      }}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"