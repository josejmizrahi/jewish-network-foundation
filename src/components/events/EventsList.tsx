import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { LoadingSkeleton } from "./list/LoadingSkeleton";
import { EventDateGroup } from "./list/EventDateGroup";
import { Event, categoryColors } from "./list/types";
import { EventFilters } from "./filters/EventFilters";
import { EmptyState } from "./list/EmptyState";
import { filterEvents, groupEventsByDate } from "./list/utils/eventGrouping";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function EventsList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "past" | "all">("upcoming");
  const [activeTab, setActiveTab] = useState<"all" | "invitations">("all");

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          organizer:profiles!events_organizer_id_fkey(full_name, avatar_url)
        `)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
  });

  const { data: invitations, isLoading: invitationsLoading } = useQuery({
    queryKey: ['event-invitations'],
    queryFn: async () => {
      const { data: invitationData, error } = await supabase
        .from('event_invitations')
        .select(`
          *,
          event:events(
            *,
            organizer:profiles!events_organizer_id_fkey(full_name, avatar_url)
          )
        `)
        .eq('invitee_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return invitationData?.map(inv => inv.event) as Event[];
    },
  });

  if (eventsLoading || invitationsLoading) {
    return <LoadingSkeleton />;
  }

  if (!events?.length && !invitations?.length) {
    return <EmptyState hasFilters={false} />;
  }

  const filteredEvents = activeTab === "all" 
    ? filterEvents(events || [], search, category, timeFilter)
    : filterEvents(invitations || [], search, category, timeFilter);
  
  const groupedEvents = groupEventsByDate(filteredEvents);

  if (Object.keys(groupedEvents).length === 0) {
    return (
      <div className="space-y-8">
        <EventFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
        />
        <EmptyState hasFilters={true} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "invitations")}>
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="invitations" className="flex items-center gap-2">
            Invitations
            {invitations?.length ? (
              <Badge variant="secondary" className="ml-1">
                {invitations.length}
              </Badge>
            ) : null}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-8">
          <EventFilters
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            timeFilter={timeFilter}
            onTimeFilterChange={setTimeFilter}
          />
          {Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <EventDateGroup
              key={date}
              date={date}
              events={dateEvents}
              categoryColors={categoryColors}
            />
          ))}
        </TabsContent>
        <TabsContent value="invitations" className="space-y-8">
          <EventFilters
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            timeFilter={timeFilter}
            onTimeFilterChange={setTimeFilter}
          />
          {Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <EventDateGroup
              key={date}
              date={date}
              events={dateEvents}
              categoryColors={categoryColors}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}