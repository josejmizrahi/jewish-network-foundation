import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function MainNav() {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-serif text-2xl font-bold text-primary">JNS</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
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
        </nav>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}