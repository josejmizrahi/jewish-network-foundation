import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileImageUploadProps {
  avatarUrl: string | null;
  fullName: string | null;
  userId: string;
  onUploadComplete: (url: string) => void;
}

export function ProfileImageUpload({ avatarUrl, fullName, userId, onUploadComplete }: ProfileImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must be less than 2MB');
      }

      // Check file type
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        throw new Error('File type must be JPEG, PNG or GIF');
      }

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      // Call the callback with the new URL to update UI state
      onUploadComplete(publicUrl);

      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-32 w-32">
        <AvatarImage src={avatarUrl || ""} alt={fullName || "Profile"} />
        <AvatarFallback>{fullName?.[0] || "?"}</AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={uploading}
          className="relative"
          onClick={() => document.getElementById('avatar-upload')?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          Change Avatar
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </Button>
      </div>
    </div>
  );
}