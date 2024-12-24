import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export function HomeStats() {
  const { data: stats } = useQuery({
    queryKey: ['homepage-stats'],
    queryFn: async () => {
      const [eventsResponse, usersResponse] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true })
      ]);
      
      return {
        events: eventsResponse.count || 0,
        members: usersResponse.count || 0
      };
    }
  });

  return (
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto"
    >
      Join a thriving community of <span className="font-semibold text-primary">{stats?.members.toLocaleString() || '1000+'}</span> members, 
      with <span className="font-semibold text-primary">{stats?.events.toLocaleString() || '100+'}</span> events connecting 
      and advancing Jewish culture, values, and innovation in the digital age.
    </motion.p>
  );
}