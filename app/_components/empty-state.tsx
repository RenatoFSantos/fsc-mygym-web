import { Dumbbell } from "lucide-react";

type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Dumbbell className="size-10 text-muted-foreground" />
      <p className="text-muted-foreground font-inter-tight">{message}</p>
    </div>
  );
}
