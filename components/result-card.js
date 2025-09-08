"use client";
import { Card, CardHeader, CardContent, CardFooter, Badge, Button } from "@/components/ui";
import { getHostname, getFavicon } from "@/lib/url";

export function ResultCard({ candidate, onView }) {
  const name = candidate.display_name || candidate.usernames?.[0] || "Unknown";
  const loc = candidate.locations?.[0] || "";
  const score = Number(candidate.score || 0).toFixed(2);
  const links = (candidate.links || []).slice(0, 4);

  return (
    <Card className="p-4 transition-transform hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
      <CardHeader>
        <div>
          <div className="text-base font-medium">{name}</div>
          <div className="text-sm text-muted-foreground">{loc}</div>
        </div>
        <Badge variant="accent">Score {score}</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap text-xs">
          {links.map((l, idx) => (
            <a key={idx} href={l} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1 text-muted-foreground hover:text-foreground transition">
              <img src={getFavicon(l)} alt="" width={14} height={14} className="rounded-sm" />
              <span>{getHostname(l)}</span>
            </a>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={onView}>View details</Button>
      </CardFooter>
    </Card>
  );
}


