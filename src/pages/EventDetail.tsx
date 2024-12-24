import { MainNav } from "@/components/layout/MainNav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { EventDetail } from "@/components/events/EventDetail";
import { BottomNav } from "@/components/nav/BottomNav";

export default function EventDetailPage() {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full overflow-x-hidden">
        <AppSidebar />
        <div className="flex-1 min-w-0">
          <MainNav />
          <SidebarInset>
            <div className="container max-w-4xl mx-auto px-4 py-6 md:py-8">
              <EventDetail />
            </div>
          </SidebarInset>
          <BottomNav />
        </div>
      </div>
    </SidebarProvider>
  );
}