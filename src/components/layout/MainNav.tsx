import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { NavItems } from "@/components/nav/nav-items";
import { UserMenu } from "@/components/nav/user-menu";
import { SearchBar } from "@/components/nav/search-bar";

export function MainNav({ children }: { children?: React.ReactNode }) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {children}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-serif text-2xl font-bold text-primary">JNS</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <NavItems />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex">
            <SearchBar />
          </div>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-6 w-6" />
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
    </header>
  );
}