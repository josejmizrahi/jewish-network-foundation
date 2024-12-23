import { MainNav } from "@/components/layout/MainNav";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Index() {
  const { user } = useAuth();

  if (user) {
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
                  <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user.user_metadata.full_name || 'User'}</h2>
                  <div className="flex items-center space-x-2">
                    <Button asChild>
                      <Link to="/profile">View Profile</Link>
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Completion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {user.user_metadata.profile_completed ? '100%' : '80%'}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Complete your profile to unlock all features
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Community Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {user.user_metadata.role || 'Member'}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Your current membership level
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {user.user_metadata.points || '0'}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Points earned through participation
                      </p>
                    </CardContent>
                  </Card>
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

  return (
    <div className="min-h-screen">
      <MainNav />
      
      {/* Hero Section */}
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

      {/* Features Section */}
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