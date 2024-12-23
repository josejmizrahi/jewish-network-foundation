import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { VerificationRequestWithProfile } from "@/types/verification";

interface VerificationRequestListProps {
  requests: VerificationRequestWithProfile[];
  selectedRequestId: string | null;
  onSelectRequest: (id: string) => void;
}

export function VerificationRequestList({
  requests,
  selectedRequestId,
  onSelectRequest,
}: VerificationRequestListProps) {
  return (
    <>
      {requests?.map((request) => (
        <Card key={request.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-medium">{request.profiles.full_name}</p>
              <p className="text-sm text-muted-foreground">
                Submitted: {format(new Date(request.submitted_at), 'PPp')}
              </p>
              <Badge 
                variant={
                  request.status === 'approved' 
                    ? 'default'
                    : request.status === 'rejected'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                {request.status}
              </Badge>
            </div>
            <Button
              variant="outline"
              onClick={() => onSelectRequest(request.id)}
              disabled={request.status !== 'pending'}
            >
              Review
            </Button>
          </div>
        </Card>
      ))}
    </>
  );
}