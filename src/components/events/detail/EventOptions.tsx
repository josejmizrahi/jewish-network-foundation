import { Switch } from "@/components/ui/switch";

interface EventOptionsProps {
  maxCapacity: number | null;
  currentAttendees: number;
}

export function EventOptions({ maxCapacity, currentAttendees }: EventOptionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
        <div>
          <div className="font-medium">Tickets</div>
          <div className="text-sm text-slate-400">Free</div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
        <div>
          <div className="font-medium">Require Approval</div>
          <div className="text-sm text-slate-400">Manually approve attendees</div>
        </div>
        <Switch />
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
        <div>
          <div className="font-medium">Capacity</div>
          <div className="text-sm text-slate-400">
            {maxCapacity ? `${currentAttendees}/${maxCapacity}` : 'Unlimited'}
          </div>
        </div>
      </div>
    </div>
  );
}