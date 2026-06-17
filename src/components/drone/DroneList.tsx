import { DRONE_LABELS, DroneState } from "@/lib/patterns/Drone";
import { ControlCenter } from "@/lib/patterns/ControlCenter";
import {
  CancelDeliveryCommand, LandCommand, ReturnToBaseCommand, TakeOffCommand,
} from "@/lib/patterns/Command";
import { Battery, Plane, Home, X, RotateCcw } from "lucide-react";

const statusColor: Record<string, string> = {
  idle: "text-muted-foreground",
  flying: "text-primary",
  returning: "text-info",
  charging: "text-warning",
  maintenance: "text-destructive",
};

const statusLabel: Record<string, string> = {
  idle: "Em Base", flying: "Em Voo", returning: "Retornando", charging: "Carregando", maintenance: "Manutenção",
};

export function DroneList({ drones }: { drones: DroneState[] }) {
  const center = ControlCenter.getInstance();
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Frota</p>
          <h3 className="font-display text-lg">Gerenciamento de Drones</h3>
        </div>
        <div className="flex gap-1">
          {(["light", "fast", "heavy", "medical"] as const).map((t) => (
            <button key={t} onClick={() => center.addDrone(t)}
              className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md border border-border hover:border-primary hover:text-primary transition">
              + {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
        {drones.map((d) => (
          <div key={d.id} className="rounded-xl border border-border bg-secondary/30 p-3 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/15 border border-primary/30 grid place-items-center">
                  <Plane className="size-4 text-primary" />
                </div>
                <div>
                  <p className="font-mono text-sm">{d.id} <span className="text-muted-foreground">• {d.name}</span></p>
                  <p className="text-[11px] text-muted-foreground">{DRONE_LABELS[d.type]}</p>
                </div>
              </div>
              <div className={`text-xs font-mono ${statusColor[d.status]}`}>{statusLabel[d.status]}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 text-[11px]">
              <div>
                <p className="text-muted-foreground">Velocidade</p>
                <p className="font-mono text-foreground">{d.speed} km/h</p>
              </div>
              <div>
                <p className="text-muted-foreground">Carga máx</p>
                <p className="font-mono text-foreground">{d.maxLoad} kg</p>
              </div>
              <div>
                <p className="text-muted-foreground">Posição</p>
                <p className="font-mono text-foreground">{d.location.x.toFixed(0)},{d.location.y.toFixed(0)}</p>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-muted-foreground flex items-center gap-1"><Battery className="size-3" /> Bateria</span>
                <span className="font-mono">{d.battery.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full transition-all"
                  style={{
                    width: `${d.battery}%`,
                    background: d.battery > 50 ? "var(--success)" : d.battery > 20 ? "var(--warning)" : "var(--destructive)",
                  }} />
              </div>
            </div>

            <div className="flex gap-1 mt-3">
              <CmdBtn onClick={() => center.executeCommand(d.id, new TakeOffCommand())} icon={<Plane className="size-3" />} label="Voar" />
              <CmdBtn onClick={() => center.executeCommand(d.id, new LandCommand())} icon={<Home className="size-3" />} label="Pousar" />
              <CmdBtn onClick={() => center.executeCommand(d.id, new ReturnToBaseCommand())} icon={<RotateCcw className="size-3" />} label="Base" />
              <CmdBtn onClick={() => center.executeCommand(d.id, new CancelDeliveryCommand())} icon={<X className="size-3" />} label="Cancelar" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CmdBtn({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick}
      className="flex-1 flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider px-2 py-1.5 rounded-md border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition">
      {icon} {label}
    </button>
  );
}
