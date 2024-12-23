interface EmptyStateProps {
  hasFilters: boolean;
}

export function EmptyState({ hasFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-card rounded-xl">
      <p className="text-muted-foreground">
        {hasFilters ? "No events match your filters" : "No events found"}
      </p>
    </div>
  );
}