import { cn } from "@/lib/cn";

export function Badge({ className, variant = "outline", ...props }) {
  const variants = {
    outline: "border border-white/10 text-foreground/90",
    accent: "bg-accent/20 text-accent",
    muted: "bg-muted/60 text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}


