import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-24 w-full rounded-md bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground/70 focus-ring",
        className
      )}
      {...props}
    />
  );
});


