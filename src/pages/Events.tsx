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
        <div className="flex-1 flex flex-col min-w-0">
          <MainNav />
          <SidebarInset>
            <div className="flex-1 space-y-8 p-8 max-w-7xl mx-auto w-full">
              <EventsHeader onCreateEvent={() => setIsCreateDialogOpen(true)} />
              <EventsList />
              <CreateEventDialog 
                open={isCreateDialogOpen} 
                onOpenChange={setIsCreateDialogOpen} 
              />
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}