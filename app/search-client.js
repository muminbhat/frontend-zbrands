"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Textarea, Badge, Card, CardHeader, CardContent, CardFooter, Skeleton } from "@/components/ui";
import { startSearch, getStatus, chooseCandidate, answer as answerApi } from "@/lib/api";
import { ResultCard } from "@/components/result-card";
import { DetailView } from "@/components/detail-view";
import { ProfileCard } from "@/components/profile-card";
import { SearchingAnimation } from "@/components/searching-animation";

const fields = ["name", "location", "email", "phone", "username", "context_text"];

export default function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState(() => {
    const initial = {};
    for (const k of fields) initial[k] = searchParams.get(k) || "";
    return initial;
  });
  const [touched, setTouched] = useState(false);
  const debounceRef = useRef();
  const pollRef = useRef();
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answerForm, setAnswerForm] = useState({ name: "", location: "", email: "", phone: "", username: "", context_text: "" });
  const [isChoosing, setIsChoosing] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [deepSearching, setDeepSearching] = useState(false);

  const update = (key) => (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
    setTouched(true);
  };

  const isValid = useMemo(() => fields.some((k) => (form[k] || "").trim().length > 0), [form]);

  const persistToUrl = useCallback(
    (state) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const k of fields) {
        const v = (state[k] || "").trim();
        if (v) next.set(k, v);
        else next.delete(k);
      }
      router.replace(`/?${next.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    if (!touched) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => persistToUrl(form), 300);
    return () => clearTimeout(debounceRef.current);
  }, [form, persistToUrl, touched]);

  const onSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    setError("");
    setResult(null);
    setStatus("queued");
    startSearch(form)
      .then((r) => {
        setJobId(r.job_id);
        setStatus(r.status);
      })
      .catch((err) => {
        setError(err.message || "Failed to start search");
        setStatus("failed");
      });
  };

  // Polling with backoff
  useEffect(() => {
    if (!jobId) return;
    let active = true;
    let attempt = 0;

    const tick = async () => {
      try {
        const res = await getStatus(jobId);
        if (!active) return;
        setStatus(res.status);
        if (res.result) setResult(res.result);
        if (res.error) setError(res.error);

        if (res.status === "queued" || res.status === "running" || res.status === "needs_disambiguation") {
          attempt += 1;
          const delay = Math.min(4000, 600 + attempt * 300);
          pollRef.current = setTimeout(tick, delay);
        }
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to fetch status");
        attempt += 1;
        const delay = Math.min(6000, 800 + attempt * 400);
        pollRef.current = setTimeout(tick, delay);
      }
    };

    tick();
    return () => {
      active = false;
      clearTimeout(pollRef.current);
    };
  }, [jobId]);

  const onClear = () => {
    const empty = {};
    for (const k of fields) empty[k] = "";
    setForm(empty);
    setTouched(false);
    const next = new URLSearchParams(searchParams.toString());
    for (const k of fields) next.delete(k);
    router.replace("/");
  };

  return (
    <div className="grid gap-6 md:gap-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Search for a person</h1>
        <p className="mt-2 text-sm text-muted-foreground">Provide name, location, or other identifiers for best results.</p>
      </div>

      <section className="card p-5 md:p-6">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <label className="text-sm text-muted-foreground">Full name</label>
            <Input value={form.name} onChange={update("name")} placeholder="e.g., Jane Doe" aria-invalid={!isValid && touched} />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm text-muted-foreground">Location</label>
            <Input value={form.location} onChange={update("location")} placeholder="e.g., New York" />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm text-muted-foreground">Email</label>
            <Input type="email" value={form.email} onChange={update("email")} placeholder="jane@example.com" />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm text-muted-foreground">Phone</label>
            <Input value={form.phone} onChange={update("phone")} placeholder="+1 555 123 4567" />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm text-muted-foreground">Username/Handle</label>
            <Input value={form.username} onChange={update("username")} placeholder="github/twitter handle" />
          </div>
          <div className="grid gap-1.5 md:col-span-2">
            <label className="text-sm text-muted-foreground">Context</label>
            <Textarea value={form.context_text} onChange={update("context_text")} placeholder="e.g., Works in fintech, NYC; previously at Stripe" />
          </div>

          {!isValid && touched && (
            <div className="md:col-span-2 text-sm text-red-400">
              Please enter at least one of: name, location, email, phone, username, or context.
            </div>
          )}

          <div className="md:col-span-2 flex items-center gap-3 pt-1">
            <Button type="submit" variant="accent" disabled={!isValid}>Search</Button>
            <Button type="button" variant="outline" onClick={onClear}>Clear</Button>
          </div>
        </form>
      </section>

      {/* States */}
      {error && (
        <div className="text-sm text-red-400">{error}</div>
      )}

      {(status === "queued" || status === "running") && (
        <div className="grid gap-6">
          <SearchingAnimation />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-5 w-32" />
                <div className="mt-3 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="mt-4">
                  <Skeleton className="h-9 w-28" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {status === "completed" && result && (
        <div className="grid gap-6">
          <ProfileCard profile={result.profile || {}} metrics={result.metrics || {}} />
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(result.candidates || []).map((c, i) => (
              <ResultCard key={i} candidate={c} onView={() => setSelectedIndex(i)} />
            ))}
          </section>
          {(!result.candidates || result.candidates.length === 0) && (
            <div className="text-sm text-muted-foreground">No candidates found. You can try providing more details above.</div>
          )}
        </div>
      )}

      {status === "needs_disambiguation" && result && (
        <section className="grid gap-6">
          <div className="text-sm text-muted-foreground">We found multiple potential matches. Please select the correct one or provide more details.</div>

          {/* Questions */}
          {(result.questions || []).length > 0 && (
            <div className="card p-4">
              <div className="text-sm font-medium">Questions</div>
              <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                {(result.questions || []).map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Candidates */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(result.candidates || []).map((c, i) => (
              <Card key={i}>
                <CardHeader>
                  <div>
                    <div className="text-base font-medium">{c.display_name || c.usernames?.[0] || "Unknown"}</div>
                    <div className="text-sm text-muted-foreground">{c.locations?.[0] || ""}</div>
                  </div>
                  <Badge variant="accent">Score {Number(c.score || 0).toFixed(2)}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap text-xs">
                    {(c.links || []).slice(0, 3).map((l, idx) => (
                      <Badge key={idx} variant="muted">{new URL(l).hostname.replace("www.", "")}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button disabled={isChoosing} onClick={async () => {
                    if (!jobId) return;
                    setIsChoosing(true);
                    try {
                      const res = await chooseCandidate(jobId, i);
                      setStatus(res.status);
                      setResult(res.result || null);
                    } catch (err) {
                      setError(err.message || "Failed to choose candidate");
                    } finally {
                      setIsChoosing(false);
                    }
                  }}>Choose</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Provide more details */}
          <div className="card p-4">
            <div className="text-sm font-medium">Provide more details</div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Full name" value={answerForm.name} onChange={(e) => setAnswerForm((f) => ({ ...f, name: e.target.value }))} />
              <Input placeholder="Location" value={answerForm.location} onChange={(e) => setAnswerForm((f) => ({ ...f, location: e.target.value }))} />
              <Input placeholder="Email" value={answerForm.email} onChange={(e) => setAnswerForm((f) => ({ ...f, email: e.target.value }))} />
              <Input placeholder="Phone" value={answerForm.phone} onChange={(e) => setAnswerForm((f) => ({ ...f, phone: e.target.value }))} />
              <Input placeholder="Username" value={answerForm.username} onChange={(e) => setAnswerForm((f) => ({ ...f, username: e.target.value }))} />
              <Textarea placeholder="Context" value={answerForm.context_text} onChange={(e) => setAnswerForm((f) => ({ ...f, context_text: e.target.value }))} />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Button disabled={isAnswering} onClick={async () => {
                setIsAnswering(true);
                try {
                  // Send hints to backend (best-effort)
                  if (jobId) {
                    try { await answerApi(jobId, answerForm); } catch {}
                  }

                  // Merge hints into current form and restart a fresh search for visible progress
                  const merged = { ...form };
                  for (const k of fields) {
                    if ((answerForm[k] || "").trim()) merged[k] = answerForm[k];
                  }
                  setForm(merged);
                  setTouched(true);
                  persistToUrl(merged);

                  setError("");
                  setResult(null);
                  setStatus("queued");
                  const r = await startSearch(merged);
                  setJobId(r.job_id);
                  setStatus(r.status);
                  setAnswerForm({ name: "", location: "", email: "", phone: "", username: "", context_text: "" });
                } catch (err) {
                  setError(err.message || "Failed to submit details");
                } finally {
                  setIsAnswering(false);
                }
              }}>Submit details</Button>
              <Button variant="outline" onClick={() => setAnswerForm({ name: "", location: "", email: "", phone: "", username: "", context_text: "" })}>Clear</Button>
            </div>
            {isAnswering && (
              <div className="mt-2 text-xs text-muted-foreground">Refining search with your details…</div>
            )}
          </div>
        </section>
      )}
      {/* Empty states */}
      {!status && (
        <div className="text-sm text-muted-foreground">
          Enter some details above and hit Search to get started.
        </div>
      )}

      {status === "completed" && (!result || (result.candidates || []).length === 0) && (
        <div className="text-sm text-muted-foreground">No results found. Try adding a location, username, or context.</div>
      )}

      <DetailView
        open={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        candidate={selectedIndex !== null ? (result?.candidates || [])[selectedIndex] : null}
        profile={result?.profile}
        metrics={result?.metrics}
        deepSearching={deepSearching}
        onDeepSearch={async () => {
          const cand = selectedIndex !== null ? (result?.candidates || [])[selectedIndex] : null;
          if (!cand) return;
          const seed = {
            name: cand.display_name || "",
            location: (cand.locations || [])[0] || "",
            email: (cand.emails || [])[0] || "",
            phone: (cand.phones || [])[0] || "",
            username: (cand.usernames || [])[0] || "",
            context_text: (result?.profile?.bios || [""])[0] || "",
          };
          setDeepSearching(true);
          setError("");
          setResult(null);
          setStatus("queued");
          try {
            const r = await startSearch(seed);
            setJobId(r.job_id);
            setStatus(r.status);
          } catch (err) {
            setError(err.message || "Failed to start deep search");
            setStatus("failed");
          } finally {
            setDeepSearching(false);
          }
        }}
      />
    </div>
  );
}


