import { MainNav } from "@/components/layout/MainNav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { EventDetail } from "@/components/events/EventDetail";

export default function EventDetailPage() {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full overflow-x-hidden">
        <AppSidebar />
        <div className="flex-1 min-w-0">
          <MainNav />
          <SidebarInset>
            <div className="container max-w-full px-4 py-4 md:py-8">
              <EventDetail />
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}