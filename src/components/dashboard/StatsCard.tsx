import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  value: string | number;
  label: string;
}

export function StatsCard({ value, label }: StatsCardProps) {
  return (
    <Card className="bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <CardContent className="p-6">
        <div className="space-y-2">
          <div className="text-4xl font-light">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}