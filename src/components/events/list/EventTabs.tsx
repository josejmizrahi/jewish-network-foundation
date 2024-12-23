import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Bell } from "lucide-react";
import { ReactNode } from "react";

interface EventTabsProps {
  activeTab: "all" | "invitations";
  onTabChange: (value: "all" | "invitations") => void;
  invitationsCount: number;
  children: ReactNode;
}

export function EventTabs({ activeTab, onTabChange, invitationsCount, children }: EventTabsProps) {
  return (
    <Tabs 
      defaultValue={activeTab} 
      value={activeTab} 
      onValueChange={(value) => onTabChange(value as "all" | "invitations")}
      className="w-full"
    >
      <TabsList className="w-full mb-4">
        <TabsTrigger value="all" className="flex-1 flex items-center justify-center gap-2">
          <Calendar className="h-4 w-4" />
          All Events
        </TabsTrigger>
        <TabsTrigger value="invitations" className="flex-1 flex items-center justify-center gap-2">
          <Bell className="h-4 w-4" />
          Invitations
          {invitationsCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {invitationsCount}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>
      <TabsContent value={activeTab} className="mt-0">
        {children}
      </TabsContent>
    </Tabs>
  );
}