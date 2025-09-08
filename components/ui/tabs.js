"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function Tabs({ tabs, initial = 0, children }) {
  const [active, setActive] = useState(initial);
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "h-9 rounded-md px-3 text-sm",
              i === active ? "bg-accent text-accent-foreground" : "border border-white/10 hover:bg-white/5"
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div>{Array.isArray(children) ? children[active] : children}</div>
    </div>
  );
}


