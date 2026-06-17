import { ROUTE_STRATEGIES } from "@/lib/patterns/RouteStrategy";
import { Zap, Leaf, ShieldCheck, CloudRain } from "lucide-react";

const meta = {
  fastest: { Icon: Zap, color: "text-warning border-warning/30", desc: "Trajeto direto, prioriza tempo." },
  economic: { Icon: Leaf, color: "text-success border-success/30", desc: "Minimiza consumo de bateria." },
  safe: { Icon: ShieldCheck, color: "text-info border-info/30", desc: "Evita zonas de risco aéreo." },
  weather: { Icon: CloudRain, color: "text-accent border-accent/30", desc: "Otimizado p/ ventos e chuva." },
} as const;

export function RouteStrategies() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Strategy Pattern</p>
        <h3 className="font-display text-lg">Estratégias de Rota</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Object.values(ROUTE_STRATEGIES).map((s) => {
          const m = meta[s.key];
          const sample = s.calculate(8, 80);
          return (
            <div key={s.key} className={`rounded-xl border p-3 bg-secondary/20 ${m.color}`}>
              <div className="flex items-center gap-2">
                <m.Icon className="size-4" />
                <p className="text-xs font-semibold text-foreground">{s.label}</p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{m.desc}</p>
              <div className="mt-2 grid grid-cols-3 gap-1 text-[10px] font-mono">
                <div><span className="text-muted-foreground">d:</span> {sample.distanceKm.toFixed(1)}km</div>
                <div><span className="text-muted-foreground">eta:</span> {sample.etaMin.toFixed(0)}m</div>
                <div><span className="text-muted-foreground">bat:</span> {sample.batteryCost.toFixed(0)}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
