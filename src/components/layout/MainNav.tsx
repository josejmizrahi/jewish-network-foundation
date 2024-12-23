import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";

export function MainNav() {
  const { user, signOut } = useAuth();

  const NavItems = () => (
    <>
      <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
        About
      </Link>
      <Link to="/community" className="text-muted-foreground hover:text-primary transition-colors">
        Community
      </Link>
      <Link to="/resources" className="text-muted-foreground hover:text-primary transition-colors">
        Resources
      </Link>
      {user ? (
        <>
          <Button asChild variant="outline">
            <Link to="/profile">Profile</Link>
          </Button>
          <Button onClick={signOut}>Sign Out</Button>
        </>
      ) : (
        <>
          <Button asChild variant="outline">
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/login">Join Now</Link>
          </Button>
        </>
      )}
    </>
  );

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-serif text-2xl font-bold text-primary">JNS</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <NavItems />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 w-[200px] lg:w-[300px]"
            />
          </div>

          {/* Mobile Navigation */}
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
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}