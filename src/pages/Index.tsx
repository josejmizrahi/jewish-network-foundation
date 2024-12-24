import { MainNav } from "@/components/layout/MainNav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { DashboardEvents } from "@/components/dashboard/DashboardEvents";
import { DashboardActivity } from "@/components/dashboard/DashboardActivity";
import { motion } from "framer-motion";
import { Calendar, Users, Share2, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export default function Index() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['homepage-stats'],
    queryFn: async () => {
      const [eventsCount, usersCount] = await Promise.all([
        supabase.from('events').count(),
        supabase.from('profiles').count()
      ]);
      
      return {
        events: eventsCount.count || 0,
        members: usersCount.count || 0
      };
    },
    enabled: !user // Only fetch stats for non-authenticated users
  });

  const { data: upcomingEvents } = useQuery({
    queryKey: ['homepage-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          title,
          start_time,
          location,
          is_online,
          category,
          current_attendees,
          max_capacity,
          organizer:profiles!events_organizer_id_fkey (
            full_name
          )
        `)
        .eq('status', 'published')
        .eq('is_private', false)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !user // Only fetch events for non-authenticated users
  });

  if (user) {
    return (
      <SidebarProvider defaultOpen>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <MainNav>
              <SidebarTrigger className="mr-2" />
            </MainNav>
            <SidebarInset>
              <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0"
                >
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Welcome back, {user.user_metadata.full_name || 'User'}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Button asChild size="lg">
                      <Link to="/events">View All Events</Link>
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <DashboardStats />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-7"
                >
                  <DashboardChart />
                  <DashboardEvents />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <DashboardActivity user={user} />
                </motion.div>
              </div>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <div className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[500px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background/50 to-background" />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto"
              >
                Join a thriving community of {stats?.members || '1000+'} members, with {stats?.events || '100+'} events 
                connecting and advancing Jewish culture, values, and innovation in the digital age.
              </motion.p>
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
        </div>

        {/* Feature Showcase Section with Real Data */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <Calendar className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Community Events</h3>
                <div className="space-y-4">
                  {upcomingEvents?.map(event => (
                    <div key={event.id} className="border-t pt-4 first:border-t-0 first:pt-0">
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(event.start_time), 'MMM d, h:mm a')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        {event.is_online ? (
                          <>
                            <MapPin className="h-4 w-4" />
                            <span>Online Event</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4" />
                            <span>{event.location || 'Location TBA'}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button variant="ghost" className="w-full" asChild>
                  <Link to="/events" className="flex items-center justify-center gap-2">
                    View All Events
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="relative overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <Share2 className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Easy Sharing</h3>
                <p className="text-muted-foreground">
                  Share events with friends and family across any platform. 
                  Invite others to join and grow our community together.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">WhatsApp</Badge>
                  <Badge variant="secondary">Email</Badge>
                  <Badge variant="secondary">Social Media</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Private Events</h3>
                <p className="text-muted-foreground">
                  Create private events for select groups. Manage invitations 
                  and RSVPs with our intuitive event management system.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Invitation-only Access</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}