import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Search, Tag, Clock, Filter } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EventFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  timeFilter: "upcoming" | "past" | "all";
  onTimeFilterChange: (value: "upcoming" | "past" | "all") => void;
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  availableTags: string[];
  showMyEvents: boolean;
  onMyEventsChange: (value: boolean) => void;
}

export function EventFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  timeFilter,
  onTimeFilterChange,
  selectedTags,
  onTagSelect,
  availableTags,
  showMyEvents,
  onMyEventsChange,
}: EventFiltersProps) {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Category
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Category Filter</h4>
                  <p className="text-sm text-muted-foreground">
                    Select an event category to filter by.
                  </p>
                </div>
                <RadioGroup value={category} onValueChange={onCategoryChange}>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all">All Categories</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="conference" id="conference" />
                      <Label htmlFor="conference">Conference</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="workshop" id="workshop" />
                      <Label htmlFor="workshop">Workshop</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="meetup" id="meetup" />
                      <Label htmlFor="meetup">Meetup</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="social" id="social" />
                      <Label htmlFor="social">Social</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Time Filter</h4>
                  <p className="text-sm text-muted-foreground">
                    Filter events by time period.
                  </p>
                </div>
                <RadioGroup value={timeFilter} onValueChange={onTimeFilterChange}>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="time-all" />
                      <Label htmlFor="time-all">All Time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upcoming" id="upcoming" />
                      <Label htmlFor="upcoming">Upcoming</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="past" id="past" />
                      <Label htmlFor="past">Past</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </PopoverContent>
          </Popover>

          {availableTags.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Tags Filter</h4>
                    <p className="text-sm text-muted-foreground">
                      Select tags to filter events.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => onTagSelect(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {user && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="myEvents"
              checked={showMyEvents}
              onChange={(e) => onMyEventsChange(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="myEvents">My Events</Label>
          </div>
        )}
      </div>
    </div>
  );
}