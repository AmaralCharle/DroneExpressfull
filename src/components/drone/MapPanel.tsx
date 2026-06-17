import { DroneState } from "@/lib/patterns/Drone";
import { Order, Weather } from "@/lib/patterns/ControlCenter";

const typeColor: Record<string, string> = {
  light: "oklch(0.78 0.18 200)",
  fast: "oklch(0.82 0.17 80)",
  heavy: "oklch(0.70 0.20 305)",
  medical: "oklch(0.65 0.24 25)",
};

export function MapPanel({ drones, orders, weather }: { drones: DroneState[]; orders: Order[]; weather: Weather }) {
  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Mapa Operacional</p>
          <h3 className="font-display text-lg">Setor Alfa-7 • Live</h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="size-2 rounded-full bg-success blink" />
          <span className="text-muted-foreground">Transmissão ativa</span>
          <span className="ml-3 px-2 py-1 rounded-md bg-secondary text-foreground/80 uppercase tracking-wider">
            Clima: {weather}
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-[16/10] min-h-[420px] rounded-xl border border-border grid-bg overflow-hidden scan-line">
        {/* Base */}
        <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
          <div className="absolute inset-0 size-12 rounded-full bg-primary/20 pulse-ring" />
          <div className="size-12 rounded-full bg-primary/30 border border-primary glow-primary grid place-items-center">
            <span className="text-[10px] font-mono text-primary-foreground">BASE</span>
          </div>
        </div>

        {/* Destinations */}
        {orders.filter((o) => o.status === "in_transit").map((o) => (
          <div key={o.id} className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${o.destination.x}%`, top: `${o.destination.y}%` }}>
            <div className="size-3 rotate-45 border-2 border-warning bg-warning/20" />
            <div className="mt-1 text-[10px] font-mono text-warning whitespace-nowrap">{o.id}</div>
          </div>
        ))}

        {/* Drones */}
        {drones.map((d) => (
          <div key={d.id} className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{ left: `${d.location.x}%`, top: `${d.location.y}%` }}>
            <div className="relative drift">
              <div className="absolute inset-0 rounded-full pulse-ring"
                style={{ backgroundColor: typeColor[d.type] + "33" }} />
              <div className="size-3 rounded-full"
                style={{ backgroundColor: typeColor[d.type], boxShadow: `0 0 12px ${typeColor[d.type]}` }} />
            </div>
            <div className="mt-1 text-[9px] font-mono text-foreground/70 whitespace-nowrap">{d.id}</div>
          </div>
        ))}

        {/* Concentric rings */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
          {[80, 160, 240].map((r) => (
            <circle key={r} cx="50%" cy="50%" r={r} fill="none" stroke="oklch(0.78 0.18 200)" strokeDasharray="3 6" />
          ))}
        </svg>
      </div>

      <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
        {Object.entries(typeColor).map(([k, c]) => (
          <div key={k} className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: c }} />
            <span className="capitalize">{k}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
