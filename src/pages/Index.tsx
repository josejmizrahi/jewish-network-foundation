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
              <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user.user_metadata.full_name || 'User'}</h2>
                  <div className="flex items-center space-x-2">
                    <Button asChild>
                      <Link to="/profile">View Profile</Link>
                    </Button>
                  </div>
                </div>

                <DashboardStats />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <DashboardChart />
                  <DashboardEvents />
                </div>

                <DashboardActivity user={user} />
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
      
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Building the Digital Jewish Nation
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Join a global community dedicated to preserving and advancing Jewish culture, 
              values, and innovation in the digital age.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link to="/login">Join Now</Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Our Community</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to connect and grow
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Access resources, join study groups, participate in events, and connect with 
            like-minded individuals from around the world.
          </p>
        </div>
      </div>
    </div>
  );
}