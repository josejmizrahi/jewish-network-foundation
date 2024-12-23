import type { TooltipContentProps } from "@radix-ui/react-tooltip"
import type { VariantProps } from "class-variance-authority"
import { sidebarMenuButtonVariants } from "./variants"

export type SidebarState = "expanded" | "collapsed"

export type SidebarContext = {
  state: SidebarState
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

export type SidebarMenuButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | Partial<TooltipContentProps>
} & VariantProps<typeof sidebarMenuButtonVariants>