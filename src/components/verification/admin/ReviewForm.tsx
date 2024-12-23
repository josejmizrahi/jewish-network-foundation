import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface ReviewFormProps {
  status: "approved" | "rejected";
  reviewNotes: string;
  isUpdating: boolean;
  onStatusChange: (status: "approved" | "rejected") => void;
  onNotesChange: (notes: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function ReviewForm({
  status,
  reviewNotes,
  isUpdating,
  onStatusChange,
  onNotesChange,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select
          value={status}
          onValueChange={(value: "approved" | "rejected") => onStatusChange(value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="approved">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Approve
              </div>
            </SelectItem>
            <SelectItem value="rejected">
              <div className="flex items-center">
                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                Reject
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Review Notes</label>
        <Textarea
          value={reviewNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add your review notes here..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isUpdating}
        >
          {isUpdating && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Submit Review
        </Button>
      </div>
    </div>
  );
}