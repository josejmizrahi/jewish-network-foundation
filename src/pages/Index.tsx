import { MainNav } from "@/components/layout/MainNav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { DashboardEvents } from "@/components/dashboard/DashboardEvents";
import { DashboardActivity } from "@/components/dashboard/DashboardActivity";
import { motion } from "framer-motion";
import { Share2, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeStats } from "@/components/home/HomeStats";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";

export default function Index() {
  const { user } = useAuth();

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
                  <DashboardMetrics />
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
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            <FeaturedEvents />

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