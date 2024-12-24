import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { NavItems } from "@/components/nav/nav-items";
import { UserMenu } from "@/components/nav/user-menu";
import { SearchBar } from "@/components/nav/search-bar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NotificationsMenu } from "@/components/nav/notifications-menu";
import { useAuth } from "@/hooks/useAuth";
import { PageBreadcrumb } from "@/components/nav/Breadcrumb";
import { motion } from "framer-motion";

export function MainNav({ children }: { children?: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="h-full flex items-center px-6">
        <div className="flex items-center gap-6 md:gap-8">
          {children}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-serif text-xl font-bold text-primary">JNS</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <NavItems />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="hidden md:flex">
            <SearchBar />
          </div>

          <ThemeToggle />

          {user && <NotificationsMenu />}

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="shrink-0">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <NavItems />
                <div className="md:hidden">
                  <SearchBar />
                </div>
                <UserMenu />
              </nav>
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex items-center gap-4">
            <UserMenu />
          </div>
        </div>
      </div>
      <div className="px-6 py-2 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <PageBreadcrumb />
      </div>
    </motion.header>
  );
}