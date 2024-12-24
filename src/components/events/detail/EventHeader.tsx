import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Share2, Lock, Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface EventHeaderProps {
  title: string;
  description: string | null;
  isPrivate: boolean;
  isOrganizer: boolean;
  onEdit: () => void;
  onCancel: () => void;
  status: string;
  coverImage?: string | null;
  eventId: string;
  isShareable: boolean;
}

export function EventHeader({
  title,
  description,
  isPrivate,
  isOrganizer,
  onEdit,
  onCancel,
  status,
  coverImage,
  eventId,
  isShareable,
}: EventHeaderProps) {
  const { toast } = useToast();
  const [isSharingEnabled, setIsSharingEnabled] = useState(isShareable);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/events/${eventId}`;
    const shareData = {
      title,
      text: description || '',
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied",
          description: "Event link has been copied to clipboard",
        });
      }
    } catch (error) {
      // If share fails, fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied",
          description: "Event link has been copied to clipboard",
        });
      } catch (clipboardError) {
        toast({
          title: "Error",
          description: "Failed to share or copy event link",
          variant: "destructive",
        });
      }
    }
  };

  const toggleShareable = async () => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_shareable: !isSharingEnabled })
        .eq('id', eventId);

      if (error) throw error;

      setIsSharingEnabled(!isSharingEnabled);
      toast({
        title: isSharingEnabled ? "Sharing disabled" : "Sharing enabled",
        description: isSharingEnabled 
          ? "This event is no longer publicly shareable" 
          : "Anyone with the link can now view this event",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update sharing settings",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {coverImage ? (
        <div className="overflow-hidden rounded-lg border bg-card">
          <AspectRatio ratio={16 / 9}>
            <img
              src={coverImage}
              alt={title}
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
      
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {status === 'cancelled' && (
              <Badge variant="destructive" className="rounded-full">Cancelled</Badge>
            )}
            {isPrivate && (
              <Badge variant="secondary" className="rounded-full">
                <Lock className="w-3 h-3 mr-1" />
                Private
              </Badge>
            )}
            {isSharingEnabled && (
              <Badge variant="secondary" className="rounded-full">
                <Globe className="w-3 h-3 mr-1" />
                Shareable
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          {isOrganizer && status !== 'cancelled' && (
            <>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border">
                <span className="text-sm">Public link</span>
                <Switch
                  checked={isSharingEnabled}
                  onCheckedChange={toggleShareable}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={onEdit}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="rounded-full"
                onClick={onCancel}
              >
                Cancel Event
              </Button>
            </>
          )}
        </div>
      </div>
      {description && (
        <>
          <Separator />
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{description}</p>
        </>
      )}
    </div>
  );
}