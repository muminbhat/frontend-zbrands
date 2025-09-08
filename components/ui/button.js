import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Button = forwardRef(function Button(
  { className, variant = "accent", size = "md", ...props },
  ref
) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-ring disabled:opacity-60 disabled:cursor-not-allowed";
  const variants = {
    accent: "bg-accent text-accent-foreground hover:bg-accent/90",
    outline: "border border-white/10 hover:bg-white/5",
    ghost: "hover:bg-white/5",
  };
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5",
  };
  return (
    <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
});


