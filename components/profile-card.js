import { Card, CardHeader, CardContent, Badge } from "@/components/ui";

export function ProfileCard({ profile = {}, metrics = {} }) {
  const names = profile.names || [];
  const emails = profile.emails || [];
  const phones = profile.phones || [];
  const usernames = profile.usernames || [];
  const locations = profile.locations || [];

  return (
    <Card className="p-4">
      <CardHeader>
        <div>
          <div className="text-base font-medium">Profile summary</div>
          <div className="text-sm text-muted-foreground">Overall confidence: {(profile.overall_confidence ?? 0).toFixed(2)}</div>
        </div>
        {typeof metrics.latency_ms === "number" && (
          <Badge variant="accent">{metrics.latency_ms} ms</Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <Field label="Names" values={names} />
          <Field label="Locations" values={locations} />
          <Field label="Emails" values={emails} />
          <Field label="Phones" values={phones} />
          <Field label="Usernames" values={usernames} />
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, values }) {
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className="mt-1 text-foreground/90 min-h-5">
        {values && values.length > 0 ? values.join(", ") : "—"}
      </div>
    </div>
  );
}


