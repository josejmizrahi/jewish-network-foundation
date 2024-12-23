import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-time-picker/date-time-picker";
import { categoryColors } from "../list/types";

interface EventFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  startDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  endDate: Date | undefined;
  onEndDateChange: (date: Date | undefined) => void;
}

export function EventFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}: EventFiltersProps) {
  return (
    <div className="space-y-4 bg-card p-4 rounded-lg border">
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search events..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.keys(categoryColors).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <DatePicker
            date={startDate}
            setDate={onStartDateChange}
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <DatePicker
            date={endDate}
            setDate={onEndDateChange}
          />
        </div>
      </div>
    </div>
  );
}