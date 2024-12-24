import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function NavigationProgress() {
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50">
      <div className="h-full bg-primary animate-progress origin-left" />
    </div>
  );
}