"use client";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui";
import { getHostname, getFavicon } from "@/lib/url";

export function DetailView({ open, onClose, candidate, profile, metrics, onDeepSearch, deepSearching }) {
  if (!candidate && !profile) return null;
  const name = candidate?.display_name || profile?.names?.[0] || candidate?.usernames?.[0] || "Unknown";
  const formatField = (s) => (s ? s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "");
  const renderValue = (v) => {
    if (v === null || v === undefined) return <div className="text-sm">—</div>;
    if (typeof v === "object" && v.title && v.url) {
      return (
        <div className="mt-1">
          <a href={v.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 hover:bg-white/5 transition">
            <img src={getFavicon(v.url)} alt="" width={14} height={14} className="rounded-sm" />
            <span className="text-sm font-medium text-foreground/90">{v.title}</span>
            <span className="text-xs text-muted-foreground">{getHostname(v.url)}</span>
          </a>
        </div>
      );
    }
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      return <div className="text-sm text-foreground/90 break-words">{String(v)}</div>;
    }
    try {
      return (
        <pre className="mt-1 rounded-md bg-muted/50 p-2 text-xs overflow-auto max-h-40 whitespace-pre-wrap break-words">
          {JSON.stringify(v, null, 2)}
        </pre>
      );
    } catch {
      return <div className="text-sm text-foreground/90 break-words">{String(v)}</div>;
    }
  };
  return (
    <Modal open={open} onClose={onClose} title={name}>
      <Tabs tabs={["Overview", "Evidence", "Links", "Employment", "Education", "Metrics"]}>
        {/* Overview */}
        <div className="grid gap-2">
          <div className="text-sm text-muted-foreground">Location: {candidate?.locations?.[0] || profile?.locations?.[0] || "—"}</div>
          <div className="text-sm text-muted-foreground">Emails: {(candidate?.emails || profile?.emails || []).join(", ") || "—"}</div>
          <div className="text-sm text-muted-foreground">Usernames: {(candidate?.usernames || profile?.usernames || []).join(", ") || "—"}</div>
          <div className="pt-2 text-xs text-muted-foreground">Score: {typeof candidate?.score === "number" ? candidate.score.toFixed(2) : "—"}</div>
          <div className="pt-3">
            <Button onClick={onDeepSearch} disabled={deepSearching}>
              {deepSearching ? "Deep searching…" : "Deep search this person"}
            </Button>
          </div>
        </div>

        {/* Evidence */}
        <div className="grid gap-2">
          {(profile?.evidences || candidate?.top_evidence || []).slice(0, 20).map((e, i) => (
            <div key={i} className="rounded-md border border-white/10 p-3">
              <div className="text-sm font-medium">{formatField(e.field)}</div>
              {renderValue(e.value)}
              <div className="mt-1 text-xs text-muted-foreground">Confidence: {Math.round((e.confidence || 0) * 100)}%</div>
              {e.snippet && <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{e.snippet}</div>}
            </div>
          ))}
          {((profile?.evidences || candidate?.top_evidence || []).length === 0) && (
            <div className="text-sm text-muted-foreground">No evidence available.</div>
          )}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-2">
          {(candidate?.links || profile?.links || []).map((l, i) => (
            <a key={i} href={l} target="_blank" rel="noreferrer" className="rounded-md border border-white/10 px-2 py-1 text-xs text-muted-foreground hover:text-foreground">{l}</a>
          ))}
          {((candidate?.links || profile?.links || []).length === 0) && (
            <div className="text-sm text-muted-foreground">No links found.</div>
          )}
        </div>

        {/* Employment */}
        <div className="grid gap-2">
          {(profile?.employment || []).map((j, i) => (
            <div key={i} className="rounded-md border border-white/10 p-3 text-sm">
              <div className="font-medium">{j.title || "Role"} @ {j.company || "Company"}</div>
              <div className="text-muted-foreground text-xs">{j.start || ""} {j.end ? `— ${j.end}` : ""}</div>
            </div>
          ))}
          {((profile?.employment || []).length === 0) && (
            <div className="text-sm text-muted-foreground">No employment data.</div>
          )}
        </div>

        {/* Education */}
        <div className="grid gap-2">
          {(profile?.education || []).map((ed, i) => (
            <div key={i} className="rounded-md border border-white/10 p-3 text-sm">
              <div className="font-medium">{ed.school || "School"}</div>
              <div className="text-muted-foreground text-xs">{ed.degree || ""}</div>
            </div>
          ))}
          {((profile?.education || []).length === 0) && (
            <div className="text-sm text-muted-foreground">No education data.</div>
          )}
        </div>

        {/* Metrics */}
        <div className="grid gap-2 text-sm">
          <div>Latency: {metrics?.latency_ms ?? "—"} ms</div>
          <div>Tools used: {(metrics?.tools_used || []).join(", ") || "—"}</div>
          <div>API cost: ${metrics?.api_cost_usd?.toFixed ? metrics.api_cost_usd.toFixed(4) : metrics?.api_cost_usd ?? "—"}</div>
          <div className="text-xs text-muted-foreground">Steps: {(metrics?.diagnostics?.steps || []).join(" → ") || "—"}</div>
        </div>
      </Tabs>
    </Modal>
  );
}


