import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HomeStats } from "./HomeStats";

export function HomeHero() {
  return (
    <div className="py-20 sm:py-32 lg:py-40">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Building the Digital
          <span className="block text-primary">Jewish Nation</span>
        </h1>
        <HomeStats />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link to="/login">Join Now</Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <Link to="/about">Learn More</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}