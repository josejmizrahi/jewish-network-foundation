import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function NavItems() {
  const { user } = useAuth();

  if (user) {
    return (
      <>
        <Link to="/profile" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          Profile
        </Link>
        <Link to="/settings" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          Settings
        </Link>
      </>
    );
  }

  return (
    <>
      <Link to="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        About
      </Link>
      <Link to="/community" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Community
      </Link>
      <Link to="/resources" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Resources
      </Link>
    </>
  );
}