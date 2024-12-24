import { MainNav } from "@/components/layout/MainNav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAuth } from "@/hooks/useAuth";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { DashboardEvents } from "@/components/dashboard/DashboardEvents";
import { DashboardActivity } from "@/components/dashboard/DashboardActivity";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeFeatures } from "@/components/home/HomeFeatures";

export default function Index() {
  const { user } = useAuth();

  if (user) {
    return (
      <SidebarProvider defaultOpen>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <MainNav>
              <SidebarTrigger className="mr-2" />
            </MainNav>
            <SidebarInset>
              <div className="flex-1 space-y-8 p-8 pt-6 max-w-7xl mx-auto w-full">
                <DashboardHero userName={user.user_metadata.full_name} />
                <DashboardMetrics />
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
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
      <div className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[500px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background/50 to-background" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <HomeHero />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <HomeFeatures />
        </div>
      </div>
    </div>
  );
}