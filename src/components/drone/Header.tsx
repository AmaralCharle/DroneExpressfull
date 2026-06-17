import { Cpu, Radio } from "lucide-react";
import { ControlCenter, Weather } from "@/lib/patterns/ControlCenter";
import OrdersModal from "@/components/drone/OrdersModal";

export function DashHeader({ weather }: { weather: Weather }) {
  const center = ControlCenter.getInstance();
  return (
    <header className="glass rounded-2xl px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-primary/15 border border-primary/40 grid place-items-center glow-primary">
          <Cpu className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-xl tracking-widest text-glow">DRONE<span className="text-primary">EXPRESS</span></h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Central Inteligente • v2.4.1</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <Radio className="size-3.5 text-success blink" />
          <span className="text-muted-foreground">Central <span className="text-success">ONLINE</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Clima:</span>
          <select value={weather} onChange={(e) => center.setWeather(e.target.value as Weather)}
            className="bg-secondary border border-border rounded-md px-2 py-1 text-foreground text-xs uppercase tracking-wider">
            <option value="clear">Limpo</option>
            <option value="windy">Vento</option>
            <option value="rainy">Chuva</option>
            <option value="storm">Tempestade</option>
          </select>
        </div>
        <div className="font-mono text-muted-foreground">
          {new Date().toLocaleDateString("pt-BR")}
        </div>
        <div className="flex items-center gap-2">
          <OrdersModal />
          <a href="/orders" className="text-xs text-muted-foreground hover:text-foreground">Abrir aba Pedidos</a>
        </div>
      </div>
    </header>
  );
}
