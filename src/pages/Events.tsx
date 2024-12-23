import { MainNav } from "@/components/layout/MainNav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { EventsHeader } from "@/components/events/EventsHeader";
import { EventsList } from "@/components/events/EventsList";
import { CreateEventDialog } from "@/components/events/CreateEventDialog";
import { useState } from "react";

export default function Events() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-background text-foreground">
        <AppSidebar />
        <div className="flex-1">
          <MainNav />
          <SidebarInset>
            <div className="container mx-auto px-4 py-4 md:py-8">
              <div className="space-y-4 md:space-y-8">
                <EventsHeader onCreateEvent={() => setIsCreateDialogOpen(true)} />
                <EventsList />
                <CreateEventDialog 
                  open={isCreateDialogOpen} 
                  onOpenChange={setIsCreateDialogOpen} 
                />
              </div>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}