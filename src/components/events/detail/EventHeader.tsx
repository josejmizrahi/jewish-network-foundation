import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

interface EventHeaderProps {
  title: string;
  description: string | null;
  isPrivate: boolean;
  isOrganizer: boolean;
  onEdit: () => void;
  onCancel: () => void;
  status: string;
}

export function EventHeader({
  title,
  description,
  isPrivate,
  isOrganizer,
  onEdit,
  onCancel,
  status,
}: EventHeaderProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center gap-2">
          {status === 'cancelled' && (
            <Badge variant="destructive">Cancelled</Badge>
          )}
          {isPrivate && (
            <Badge variant="secondary">Private</Badge>
          )}
          {isOrganizer && status !== 'cancelled' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Event
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onCancel}
              >
                Cancel Event
              </Button>
            </>
          )}
        </div>
      </div>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
}