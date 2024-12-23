import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

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
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-serif text-2xl font-bold text-primary">JNS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavItems />
        </nav>

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
    </header>
  );
}