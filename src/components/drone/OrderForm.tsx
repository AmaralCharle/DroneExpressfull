import { useState } from "react";
import { ControlCenter, Order } from "@/lib/patterns/ControlCenter";
import { ROUTE_STRATEGIES, RouteStrategyKey } from "@/lib/patterns/RouteStrategy";
import { PackagePlus } from "lucide-react";

export function OrderForm() {
  const center = ControlCenter.getInstance();
  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");
  const [weight, setWeight] = useState(1.5);
  const [priority, setPriority] = useState<Order["priority"]>("normal");
  const [route, setRoute] = useState<RouteStrategyKey>("fastest");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !address) return;
    center.createOrder({ customer, address, weight, priority, route });
    setCustomer(""); setAddress(""); setWeight(1.5);
  };

  return (
    <form onSubmit={submit} className="glass rounded-2xl p-5 space-y-3">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Despacho</p>
        <h3 className="font-display text-lg">Novo Pedido</h3>
      </div>

      <Field label="Cliente">
        <input value={customer} onChange={(e) => setCustomer(e.target.value)}
          className="input" placeholder="Ex: Ana Silva" />
      </Field>
      <Field label="Endereço">
        <input value={address} onChange={(e) => setAddress(e.target.value)}
          className="input" placeholder="Rua, número, bairro" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Peso (kg)">
          <input type="number" min={0.1} step={0.1} value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value))} className="input" />
        </Field>
        <Field label="Prioridade">
          <select value={priority} onChange={(e) => setPriority(e.target.value as Order["priority"])} className="input">
            <option value="low">Baixa</option>
            <option value="normal">Normal</option>
            <option value="high">Alta</option>
            <option value="critical">Crítica</option>
          </select>
        </Field>
      </div>
      <Field label="Estratégia de Rota">
        <select value={route} onChange={(e) => setRoute(e.target.value as RouteStrategyKey)} className="input">
          {Object.values(ROUTE_STRATEGIES).map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </Field>

      <button type="submit"
        className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-medium py-2.5 hover:bg-primary/90 transition glow-primary">
        <PackagePlus className="size-4" /> Despachar Pedido
      </button>

      <style>{`
        .input {
          width: 100%;
          background: oklch(0.18 0.03 255);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.85rem;
          color: var(--foreground);
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus { border-color: var(--primary); box-shadow: 0 0 0 2px oklch(0.78 0.18 200 / 25%); }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
