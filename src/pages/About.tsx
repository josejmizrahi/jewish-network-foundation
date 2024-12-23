import { MainNav } from "@/components/layout/MainNav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ExternalLink, BookOpen, Users, Globe, Building2 } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { PageBreadcrumb } from "@/components/nav/Breadcrumb";

export default function About() {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <MainNav />
          <SidebarInset>
            <div className="container py-4">
              <PageBreadcrumb />
              
              {/* Hero Section */}
              <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
              Building the Digital Jewish Nation
            </h1>
            <p className="text-lg md:text-xl text-center text-muted-foreground max-w-3xl mx-auto">
              A decentralized network state uniting the Jewish people through shared values, culture, and innovation in the digital age.
            </p>
          </div>
              </section>

              {/* Core Concepts */}
              <section className="py-16">
          <h2 className="text-3xl font-bold mb-12 text-center">Core Concepts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <CardContent className="space-y-4 pt-4">
                <Globe className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Digital Sovereignty</h3>
                <p className="text-muted-foreground">
                  Creating a borderless nation united by shared values and digital infrastructure.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4 pt-4">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Community First</h3>
                <p className="text-muted-foreground">
                  Building strong connections between Jewish communities worldwide.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4 pt-4">
                <Building2 className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Cultural Preservation</h3>
                <p className="text-muted-foreground">
                  Safeguarding Jewish heritage while embracing technological innovation.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4 pt-4">
                <BookOpen className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Continuous Learning</h3>
                <p className="text-muted-foreground">
                  Fostering education and knowledge sharing across the network.
                </p>
              </CardContent>
            </Card>
          </div>
              </section>

              {/* Vision */}
              <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Our Vision</h2>
              <div className="space-y-6 text-lg">
                <p>
                  The Jewish Network State represents a revolutionary approach to Jewish continuity 
                  in the digital age. We're building a decentralized nation that transcends 
                  physical boundaries while maintaining strong connections to our heritage and traditions.
                </p>
                <p>
                  By leveraging blockchain technology, digital identity, and community governance, 
                  we're creating a framework for Jewish communities worldwide to connect, collaborate, 
                  and thrive together.
                </p>
                <p>
                  Our goal is to ensure Jewish continuity and innovation in the digital age while 
                  preserving our rich cultural heritage and values.
                </p>
              </div>
            </div>
          </div>
              </section>

              {/* Resources Section */}
              <section className="py-16">
          <h2 className="text-3xl font-bold mb-12">Essential Resources</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardContent className="space-y-4 pt-4">
                <h3 className="text-2xl font-semibold">The Network State</h3>
                <p className="text-muted-foreground">
                  By Balaji Srinivasan - A groundbreaking book that outlines how to build a digital 
                  nation, start a new country, and how the technology of the future will reshape our 
                  understanding of citizenship and governance.
                </p>
                <Button asChild variant="outline" className="mt-4">
                  <a 
                    href="https://thenetworkstate.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    Read the Book <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4 pt-4">
                <h3 className="text-2xl font-semibold">Get Involved</h3>
                <p className="text-muted-foreground">
                  Join our growing community and help shape the future of the Jewish Network State. 
                  Connect with other members, participate in governance, and contribute to our shared vision.
                </p>
                <Button asChild className="mt-4">
                  <Link to="/community" className="flex items-center gap-2">
                    Join Our Community <Users className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
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
