import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { Profile } from "@/types/profile";

interface VerificationBadgeProps {
  status: Profile['verification_status'];
}

export function VerificationBadge({ status }: VerificationBadgeProps) {
  switch (status) {
    case 'verified':
      return (
        <Badge className="bg-green-500">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Verified
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="destructive">
          <AlertCircle className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary">
          <Loader2 className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
  }
}