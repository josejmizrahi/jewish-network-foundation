import { ChevronRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface EventBreadcrumbProps {
  eventTitle: string;
}

export function EventBreadcrumb({ eventTitle }: EventBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link to="/events" className="flex items-center hover:text-foreground transition-colors">
        <Calendar className="h-4 w-4 mr-1" />
        Events
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground font-medium truncate">{eventTitle}</span>
    </nav>
  );
}