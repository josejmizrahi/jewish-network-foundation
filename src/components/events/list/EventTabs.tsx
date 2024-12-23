import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
      defaultValue="all" 
      value={activeTab} 
      onValueChange={(value) => onTabChange(value as "all" | "invitations")}
      className="w-full"
    >
      <TabsList className="w-full">
        <TabsTrigger value="all" className="flex-1">
          All Events
        </TabsTrigger>
        <TabsTrigger value="invitations" className="flex-1 flex items-center justify-center gap-2">
          Invitations
          {invitationsCount > 0 && (
            <Badge variant="secondary">
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