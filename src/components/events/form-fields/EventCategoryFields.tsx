import { UseFormReturn } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { X } from "lucide-react";
import { useState } from "react";
import type { EventFormValues } from "../schemas/eventFormSchema";

interface EventCategoryFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

const CATEGORIES = [
  'conference',
  'workshop',
  'meetup',
  'social',
  'sports',
  'entertainment',
  'education',
  'business',
  'charity',
  'other'
] as const;

export function EventCategoryFields({ form }: EventCategoryFieldsProps) {
  const [newTag, setNewTag] = useState("");
  const tags = form.watch("tags");

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      form.setValue("tags", [...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue("tags", tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <Label>Tags</Label>
        <form onSubmit={handleAddTag} className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag..."
            className="flex-1"
          />
          <Button type="submit" variant="secondary">Add</Button>
        </form>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="px-2 py-1">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}