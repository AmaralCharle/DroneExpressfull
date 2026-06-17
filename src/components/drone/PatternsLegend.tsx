const items = [
  { name: "Singleton", desc: "ControlCenter — instância única da central." },
  { name: "Factory Method", desc: "DroneFactory cria tipos de drones dinamicamente." },
  { name: "Strategy", desc: "RouteStrategy define algoritmos de rota intercambiáveis." },
  { name: "Observer", desc: "Subject notifica UI sobre eventos em tempo real." },
  { name: "Command", desc: "TakeOff, Land, Cancel, Return encapsulam ações." },
];

export function PatternsLegend() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Arquitetura</p>
        <h3 className="font-display text-lg">Design Patterns Aplicados</h3>
      </div>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.name} className="flex gap-3 text-xs items-start">
            <span className="font-mono text-primary shrink-0 w-28">{i.name}</span>
            <span className="text-muted-foreground">{i.desc}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
