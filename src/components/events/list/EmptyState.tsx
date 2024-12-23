interface EmptyStateProps {
  hasFilters: boolean;
  message?: string;
}

export function EmptyState({ hasFilters, message }: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-card rounded-xl">
      <p className="text-muted-foreground">
        {message || (hasFilters ? "No events match your filters" : "No events found")}
      </p>
    </div>
  );
}