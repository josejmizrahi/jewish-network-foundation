import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Bell, Ticket } from "lucide-react";

interface Event {
  title: string;
  date: string;
  type: string;
  icon: "calendar" | "bell" | "ticket";
}

const events: Event[] = [
  {
    title: "Community Meetup",
    date: "2024-03-20",
    type: "Meetup",
    icon: "calendar"
  },
  {
    title: "Torah Study Session",
    date: "2024-03-22",
    type: "Study",
    icon: "bell"
  },
  {
    title: "Shabbat Dinner",
    date: "2024-03-23",
    type: "Social",
    icon: "ticket"
  }
];

const iconMap = {
  calendar: Calendar,
  bell: Bell,
  ticket: Ticket
};

export function DashboardEvents() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {events.map((event) => {
            const Icon = iconMap[event.icon];
            const eventDate = new Date(event.date);
            return (
              <div key={event.title} className="flex items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium leading-none">{event.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {eventDate.toLocaleDateString()} - {event.type}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}