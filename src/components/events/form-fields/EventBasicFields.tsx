import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import type { EventFormValues } from "../schemas/eventFormSchema";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface EventBasicFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export function EventBasicFields({ form }: EventBasicFieldsProps) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('event-covers')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('event-covers')
        .getPublicUrl(filePath);

      form.setValue('cover_image', publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="cover_image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cover Image</FormLabel>
            <FormControl>
              <div className="space-y-4">
                {field.value ? (
                  <div className="overflow-hidden rounded-lg border bg-card">
                    <AspectRatio ratio={16 / 9}>
                      <img
                        src={field.value}
                        alt="Event cover"
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border bg-card">
                    <AspectRatio ratio={16 / 9}>
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">No cover image</p>
                      </div>
                    </AspectRatio>
                  </div>
                )}
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('cover-image-upload')?.click()}
                    disabled={uploading}
                    className="w-full"
                  >
                    <ImagePlus className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Cover Image'}
                  </Button>
                  <input
                    id="cover-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Event title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Event description" 
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}