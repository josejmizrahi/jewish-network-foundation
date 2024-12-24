import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "./StatsCard";

export function DashboardMetrics() {
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard value={stats?.members || 0} label="Total Members" />
      <StatsCard value={stats?.events || 0} label="Total Events" />
      <StatsCard value="Coming Soon" label="Additional Metric" />
    </div>
  );
}