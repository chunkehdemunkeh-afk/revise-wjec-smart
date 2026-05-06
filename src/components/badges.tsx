import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Priority, Status } from "@/lib/supabase";

export function PriorityBadge({ priority }: { priority: Priority }) {
  const map = {
    CORE: "bg-priority-core text-priority-core-foreground",
    COMMON: "bg-priority-common text-priority-common-foreground",
    MODERATE: "bg-priority-moderate text-priority-moderate-foreground",
  } as const;
  return (
    <Badge className={cn("border-transparent uppercase tracking-wide", map[priority])}>
      {priority}
    </Badge>
  );
}

const statusLabel: Record<Status, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  confident: "Confident",
};

export function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    not_started: "bg-muted text-muted-foreground",
    in_progress: "bg-primary/15 text-primary",
    confident: "bg-priority-core/20 text-priority-core",
  };
  return <Badge className={cn("border-transparent", map[status])}>{statusLabel[status]}</Badge>;
}
