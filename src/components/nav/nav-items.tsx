import { Link } from "react-router-dom";

export function NavItems() {
  return (
    <>
      <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
        Home
      </Link>
      <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
        About
      </Link>
      <Link to="/community" className="text-muted-foreground hover:text-primary transition-colors">
        Community
      </Link>
      <Link to="/resources" className="text-muted-foreground hover:text-primary transition-colors">
        Resources
      </Link>
    </>
  );
}