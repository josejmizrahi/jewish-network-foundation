import { Link } from "react-router-dom";

export function NavItems() {
  return (
    <>
      <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
        Home
      </Link>
    </>
  );
}