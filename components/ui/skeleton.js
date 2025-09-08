import { cn } from "@/lib/cn";

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-md bg-muted/60", className)} />;
}


