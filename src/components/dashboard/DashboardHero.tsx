import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface DashboardHeroProps {
  userName?: string;
}

export function DashboardHero({ userName }: DashboardHeroProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0"
    >
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
        Welcome back, {userName || 'User'}
      </h2>
      <div className="flex items-center space-x-2">
        <Button asChild size="lg">
          <Link to="/events">View All Events</Link>
        </Button>
      </div>
    </motion.div>
  );
}