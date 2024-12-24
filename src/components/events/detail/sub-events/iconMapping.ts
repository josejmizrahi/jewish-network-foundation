import { Calendar, Clock, Video, MapPin, Music, Users, Utensils, Book, Presentation } from "lucide-react";
import { SubEventIcon } from "./types";

export const iconComponents = {
  Calendar,
  Clock,
  Video,
  MapPin,
  Music,
  Users,
  Utensils,
  Book,
  Presentation,
} as const;

// Helper function to validate icon names
export const isValidIcon = (icon: string): icon is SubEventIcon => {
  return icon in iconComponents;
};