import { Notification } from "@/lib/patterns/Observer";
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from "lucide-react";

const icons = {
  info: Info, success: CheckCircle2, warning: AlertTriangle, danger: ShieldAlert,
};
const colors = {
  info: "text-info border-info/30",
  success: "text-success border-success/30",
  warning: "text-warning border-warning/30",
  danger: "text-destructive border-destructive/30",
};

export function NotificationsPanel({ items }: { items: Notification[] }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Observer</p>
          <h3 className="font-display text-lg">Notificações</h3>
        </div>
        <span className="text-xs font-mono text-muted-foreground">{items.length} eventos</span>
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground py-8 text-center">Aguardando eventos da central…</p>
        )}
        {items.map((n) => {
          const Icon = icons[n.level];
          return (
            <div key={n.id} className={`flex gap-3 p-2.5 rounded-lg border bg-secondary/20 animate-slide-up ${colors[n.level]}`}>
              <Icon className="size-4 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">{n.title}</p>
                <p className="text-[11px] text-muted-foreground truncate">{n.message}</p>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                {new Date(n.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
