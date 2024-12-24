import { Home, Calendar, User, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavItems } from "./nav-items";
import { UserMenu } from "./user-menu";
import { SearchBar } from "./search-bar";

export function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <div className="flex items-center justify-around h-16">
          <Link
            to="/"
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full px-2 gap-0.5 transition-colors",
              isActive("/") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link
            to="/events"
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full px-2 gap-0.5 transition-colors",
              isActive("/events") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-[10px] font-medium">Events</span>
          </Link>
          <Link
            to="/profile"
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full px-2 gap-0.5 transition-colors",
              isActive("/profile") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center flex-1 h-full px-2 gap-0.5 text-muted-foreground transition-colors">
                <Menu className="h-5 w-5" />
                <span className="text-[10px] font-medium">Menu</span>
              </button>
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
        </div>
      </nav>
      <div className="md:hidden h-16" /> {/* Spacer to prevent content from being hidden behind fixed nav */}
    </>
  );
}