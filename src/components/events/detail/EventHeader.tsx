import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface EventHeaderProps {
  title: string;
  description: string | null;
  isPrivate: boolean;
  isOrganizer: boolean;
  onEdit: () => void;
  onCancel: () => void;
  status: string;
  coverImage?: string | null;
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
}: EventHeaderProps) {
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
              <Badge variant="secondary" className="rounded-full">Private</Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => {
              navigator.share({
                title,
                text: description || '',
                url: window.location.href,
              }).catch(() => {
                navigator.clipboard.writeText(window.location.href);
              });
            }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          {isOrganizer && status !== 'cancelled' && (
            <>
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