import { cn } from "@/lib/cn";

export function Card({ className, ...props }) {
  return <div className={cn("card p-4", className)} {...props} />;
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("mb-2 flex items-start justify-between", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("mt-2 text-sm text-muted-foreground", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div className={cn("mt-4", className)} {...props} />;
}


