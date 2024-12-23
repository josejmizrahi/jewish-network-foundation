import { Checkbox } from "@/components/ui/checkbox";
import type { VerificationCriteria } from "@/types/verification";

interface CriteriaListProps {
  criteria: VerificationCriteria[];
  selectedCriteria: string[];
  onCriteriaChange: (criteria: string[]) => void;
}

export function CriteriaList({ criteria, selectedCriteria, onCriteriaChange }: CriteriaListProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Verification Criteria</h3>
      {criteria?.map((item) => (
        <div key={item.id} className="flex items-start space-x-2">
          <Checkbox
            id={item.id}
            checked={selectedCriteria.includes(item.id)}
            onCheckedChange={(checked) => {
              onCriteriaChange(
                checked
                  ? [...selectedCriteria, item.id]
                  : selectedCriteria.filter(id => id !== item.id)
              );
            }}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor={item.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {item.name}
              {item.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <p className="text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}