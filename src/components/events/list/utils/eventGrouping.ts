import { format, parseISO, isAfter, isBefore } from "date-fns";
import { Event } from "../types";

export const filterEvents = (
  events: Event[],
  search: string,
  category: string,
  timeFilter: "upcoming" | "past" | "all",
  selectedTags: string[] = []
): Event[] => {
  if (!Array.isArray(events)) return [];
  
  return events.filter(event => {
    if (!event?.start_time) return false;

    const matchesSearch = !search || 
      event.title?.toLowerCase().includes(search.toLowerCase()) ||
      event.description?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "all" || event.category === category;

    const now = new Date();
    const eventDate = parseISO(event.start_time);
    const matchesTimeFilter = timeFilter === "all" || 
      (timeFilter === "upcoming" && isAfter(eventDate, now)) ||
      (timeFilter === "past" && isBefore(eventDate, now));

    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => event.tags?.includes(tag));

    return matchesSearch && matchesCategory && matchesTimeFilter && matchesTags;
  });
};

export const groupEventsByDate = (events: Event[]): { [key: string]: Event[] } => {
  if (!Array.isArray(events)) return {};
  
  const groups: { [key: string]: Event[] } = {};
  
  events.forEach(event => {
    if (!event?.start_time) return;
    
    const date = format(new Date(event.start_time), 'MMM dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
  });
  
  return groups;
};