"use client";
import { useEffect } from "react";
import { cn } from "@/lib/cn";

export function Modal({ open, onClose, title, children, className }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "w-full max-w-3xl rounded-xl border border-white/10 bg-card text-card-foreground shadow-2xl",
            className
          )}
        >
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
            <h2 className="text-base font-medium">{title}</h2>
            <button onClick={onClose} aria-label="Close" className="rounded-md px-2 py-1 text-sm hover:bg-white/5 focus-ring">✕</button>
          </div>
          <div className="px-5 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}


