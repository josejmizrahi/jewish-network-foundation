import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { SubEventIcon } from "./types";
import { iconComponents } from "./iconMapping";

interface SubEventIconSelectProps {
  value?: SubEventIcon;
  onChange: (value: SubEventIcon) => void;
}

export function SubEventIconSelect({ value = "Calendar", onChange }: SubEventIconSelectProps) {
  const [open, setOpen] = React.useState(false);
  
  // Get all available icons from the mapping
  const icons = Object.keys(iconComponents) as SubEventIcon[];
  
  // Ensure we have a valid initial value
  const selectedIcon = value && iconComponents[value] ? value : "Calendar";
  const IconComponent = iconComponents[selectedIcon];

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
            {IconComponent && <IconComponent className="h-4 w-4" />}
            <span>{selectedIcon}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search icons..." />
          <CommandEmpty>No icon found.</CommandEmpty>
          <CommandGroup>
            {icons.map((icon) => {
              const Icon = iconComponents[icon];
              return (
                <CommandItem
                  key={icon}
                  value={icon}
                  onSelect={() => {
                    onChange(icon);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{icon}</span>
                  </div>
                  {selectedIcon === icon && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}