import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md bg-muted/50 px-3 text-sm placeholder:text-muted-foreground/70 focus-ring",
        className
      )}
      {...props}
    />
  );
});


