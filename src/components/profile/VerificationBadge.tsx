import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Clock, HelpCircle, Shield, ShieldCheck, BadgeCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Profile } from "@/types/profile";

interface VerificationBadgeProps {
  status: Profile['verification_status'];
  badgeStyle?: string;
}

export function VerificationBadge({ status, badgeStyle = 'default' }: VerificationBadgeProps) {
  const getStatusInfo = () => {
    const icons = {
      default: BadgeCheck,
      shield: Shield,
      check: CheckCircle2,
      secure: ShieldCheck,
    };

    switch (status) {
      case 'verified':
        return {
          icon: icons[badgeStyle as keyof typeof icons] || BadgeCheck,
          label: 'Verified',
          description: 'This profile has been verified by our team',
          variant: 'default' as const,
          className: badgeStyle === 'shield' ? 'bg-blue-500' :
                    badgeStyle === 'check' ? 'bg-green-500' :
                    badgeStyle === 'secure' ? 'bg-purple-500' :
                    'bg-primary'
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