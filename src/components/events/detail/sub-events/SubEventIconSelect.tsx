import { Check } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, MapPin, Music, Users, Utensils, Book, Presentation } from "lucide-react";

const icons = [
  { value: "Calendar", label: "Calendar", icon: Calendar },
  { value: "Clock", label: "Clock", icon: Clock },
  { value: "Video", label: "Video Call", icon: Video },
  { value: "MapPin", label: "Location", icon: MapPin },
  { value: "Music", label: "Music", icon: Music },
  { value: "Users", label: "Meeting", icon: Users },
  { value: "Utensils", label: "Food & Drinks", icon: Utensils },
  { value: "Book", label: "Workshop", icon: Book },
  { value: "Presentation", label: "Presentation", icon: Presentation },
] as const;

export type SubEventIcon = typeof icons[number]["value"];

interface SubEventIconSelectProps {
  value: SubEventIcon;
  onChange: (value: SubEventIcon) => void;
}

export function SubEventIconSelect({ value, onChange }: SubEventIconSelectProps) {
  const [open, setOpen] = React.useState(false);
  const selectedIcon = icons.find(icon => icon.value === value);
  const IconComponent = selectedIcon?.icon || Calendar;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <IconComponent className="h-4 w-4" />
            <span>{selectedIcon?.label || "Select icon"}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search icon..." />
          <CommandEmpty>No icon found.</CommandEmpty>
          <CommandGroup>
            {icons.map((icon) => (
              <CommandItem
                key={icon.value}
                value={icon.value}
                onSelect={() => {
                  onChange(icon.value);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === icon.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <icon.icon className="mr-2 h-4 w-4" />
                {icon.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}