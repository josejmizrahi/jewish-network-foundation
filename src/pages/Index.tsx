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
                      <Link to="/profile">View Profile</Link>
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
        {/* Background gradient */}
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
                Join a global community dedicated to preserving and advancing Jewish culture, 
                values, and innovation in the digital age.
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

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mx-auto max-w-2xl lg:text-center"
          >
            <h2 className="text-base font-semibold leading-7 text-primary">Our Community</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to connect and grow
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Access resources, join study groups, participate in events, and connect with 
              like-minded individuals from around the world.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}