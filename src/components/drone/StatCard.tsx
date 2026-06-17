import { ReactNode } from "react";

export function StatCard({
  label, value, sub, icon, accent = "primary",
}: {
  label: string; value: ReactNode; sub?: string; icon?: ReactNode;
  accent?: "primary" | "success" | "warning" | "info" | "destructive";
}) {
  const accentClass = {
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    info: "text-info",
    destructive: "text-destructive",
  }[accent];
  return (
    <div className="glass rounded-xl p-4 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
          <p className={`mt-2 font-display text-3xl font-bold ${accentClass} text-glow`}>{value}</p>
          {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
        </div>
        {icon && <div className={`${accentClass} opacity-80`}>{icon}</div>}
      </div>
    </div>
  );
}
