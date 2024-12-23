import { format, parseISO, isAfter, isBefore } from "date-fns";
import { Event } from "../types";

export const filterEvents = (
  events: Event[],
  search: string,
  category: string,
  timeFilter: "upcoming" | "past" | "all"
) => {
  return events.filter(event => {
    const matchesSearch = search === "" || 
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      (event.description?.toLowerCase().includes(search.toLowerCase()) ?? false);

    const matchesCategory = category === "all" || event.category === category;

    const now = new Date();
    const eventDate = parseISO(event.start_time);
    const matchesTimeFilter = timeFilter === "all" || 
      (timeFilter === "upcoming" && isAfter(eventDate, now)) ||
      (timeFilter === "past" && isBefore(eventDate, now));

    return matchesSearch && matchesCategory && matchesTimeFilter;
  });
};

export const groupEventsByDate = (events: Event[]) => {
  const groups: { [key: string]: Event[] } = {};
  events.forEach(event => {
    const date = format(new Date(event.start_time), 'MMM dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
  });
  return groups;
};