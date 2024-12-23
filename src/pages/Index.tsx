import { MainNav } from "@/components/layout/MainNav";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { DashboardActivity } from "@/components/dashboard/DashboardActivity";

export default function Index() {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <MainNav />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Overview</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>

            <div className="flex-1 space-y-4 p-8 pt-6">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                {user && (
                  <div className="flex items-center space-x-2">
                    <Button>
                      Download
                    </Button>
                  </div>
                )}
              </div>

              <DashboardStats />

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <DashboardChart />
                <DashboardActivity user={user} />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>About Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Building the Digital Jewish Nation - Join a global community dedicated to preserving 
                    and advancing Jewish culture, values, and innovation in the digital age.
                  </p>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">Community</p>
                        <p className="text-sm text-muted-foreground">
                          Connect with Jews worldwide
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">Identity</p>
                        <p className="text-sm text-muted-foreground">
                          Preserve Jewish identity
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">Innovation</p>
                        <p className="text-sm text-muted-foreground">
                          Build the future of Jewish life
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}