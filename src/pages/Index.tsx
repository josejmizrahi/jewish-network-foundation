import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MainNav } from "@/components/layout/MainNav";
import { Footer } from "@/components/layout/Footer";
import { PostsList } from "@/components/posts/PostsList";
import { CreatePostForm } from "@/components/posts/CreatePostForm";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Globe, Users } from "lucide-react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export default function Index() {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <MainNav />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {/* Hero Section */}
              <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
                <div className="container relative mx-auto max-w-4xl text-center">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                    Building the Digital Jewish Nation
                  </h1>
                  <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Join a global community dedicated to preserving and advancing Jewish culture, values, and innovation in the digital age.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="text-lg">
                      <Link to="/register">
                        Join the Movement
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="text-lg">
                      <Link to="/about">Learn More</Link>
                    </Button>
                  </div>
                </div>
              </section>

              {/* Posts Section */}
              <section className="py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                  <div className="space-y-8">
                    {user && <CreatePostForm />}
                    <PostsList />
                  </div>
                </div>
              </section>

              {/* Features Section */}
              <section className="py-20 px-4 bg-muted/30">
                <div className="container mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Core Pillars</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="border-2 hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Community</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          Connect with Jews worldwide, share resources, and build meaningful relationships.
                        </CardDescription>
                      </CardContent>
                    </Card>

                    <Card className="border-2 hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                          <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Identity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          Preserve and strengthen Jewish identity through digital citizenship and verification.
                        </CardDescription>
                      </CardContent>
                    </Card>

                    <Card className="border-2 hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                          <Globe className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Innovation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          Build the future of Jewish life through technology and collaboration.
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>

              {/* Call to Action Section */}
              <section className="py-20 px-4 bg-primary text-primary-foreground">
                <div className="container mx-auto max-w-4xl text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Community?</h2>
                  <p className="text-xl mb-8 text-primary-foreground/90">
                    Be part of building the future of the Jewish digital nation.
                  </p>
                  <Button asChild size="lg" variant="secondary" className="text-lg">
                    <Link to="/register">Get Started Now</Link>
                  </Button>
                </div>
              </section>
            </div>
          </SidebarInset>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}