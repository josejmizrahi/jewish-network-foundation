import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Clock, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Profile } from "@/types/profile";

interface VerificationBadgeProps {
  status: Profile['verification_status'];
}

export function VerificationBadge({ status }: VerificationBadgeProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle2,
          label: 'Verified',
          description: 'This profile has been verified by our team',
          variant: 'default' as const,
          className: 'bg-green-500'
        };
      case 'rejected':
        return {
          icon: AlertCircle,
          label: 'Rejected',
          description: 'Verification request was rejected. Please submit a new request',
          variant: 'destructive' as const
        };
      case 'pending':
        return {
          icon: Clock,
          label: 'Pending',
          description: 'Verification request is being reviewed',
          variant: 'secondary' as const
        };
      default:
        return {
          icon: HelpCircle,
          label: 'Unverified',
          description: 'No verification request submitted',
          variant: 'outline' as const
        };
    }
  };

  const { icon: Icon, label, description, variant, className } = getStatusInfo();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant={variant} className={className}>
            <Icon className="mr-1 h-3 w-3" />
            {label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}