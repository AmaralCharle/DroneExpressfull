import { Order, ControlCenter } from "@/lib/patterns/ControlCenter";
import { ROUTE_STRATEGIES } from "@/lib/patterns/RouteStrategy";
import { updateOrderApi } from '@/lib/infra/ordersApi';

const statusBadge: Record<Order["status"], string> = {
  pending: "bg-muted text-muted-foreground",
  assigned: "bg-info/20 text-info",
  in_transit: "bg-primary/20 text-primary",
  delivered: "bg-success/20 text-success",
  cancelled: "bg-destructive/20 text-destructive",
};

const priorityColor: Record<Order["priority"], string> = {
  low: "text-muted-foreground", normal: "text-foreground",
  high: "text-warning", critical: "text-destructive",
};

export function OrdersTable({ orders }: { orders: Order[] }) {
  const center = ControlCenter.getInstance();
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Operações</p>
          <h3 className="font-display text-lg">Pedidos Recentes</h3>
        </div>
        <span className="text-xs font-mono text-muted-foreground">{orders.length} no sistema</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
            <tr>
              <th className="text-left py-2 px-2">ID</th>
              <th className="text-left py-2 px-2">Cliente</th>
              <th className="text-left py-2 px-2">Endereço</th>
              <th className="text-right py-2 px-2">Peso</th>
              <th className="text-left py-2 px-2">Prioridade</th>
              <th className="text-left py-2 px-2">Rota</th>
              <th className="text-left py-2 px-2">Drone</th>
              <th className="text-left py-2 px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">Sem pedidos. Crie um para iniciar a simulação.</td></tr>
            )}
            {orders.slice(0, 12).map((o) => (
              <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/30 transition">
                <td className="py-2 px-2 font-mono text-primary">{o.id}</td>
                <td className="py-2 px-2">{o.customer}</td>
                <td className="py-2 px-2 text-muted-foreground truncate max-w-[180px]">{o.address}</td>
                <td className="py-2 px-2 text-right font-mono">{o.weight}kg</td>
                <td className={`py-2 px-2 capitalize ${priorityColor[o.priority]}`}>{o.priority}</td>
                <td className="py-2 px-2 text-muted-foreground">{o.route ? ROUTE_STRATEGIES[o.route].label : "—"}</td>
                <td className="py-2 px-2 font-mono text-muted-foreground">{o.droneId ?? "—"}</td>
                <td className="py-2 px-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider ${statusBadge[o.status]}`}>
                    {o.status.replace("_", " ")}
                  </span>
                  <div className="mt-1 flex gap-2">
                    <button onClick={async () => { await updateOrderApi(o.id, { status: 'delivered' }); await center.syncWithBackend(); }}
                      className="text-[10px] px-2 py-0.5 rounded-md border border-border hover:bg-success/10">
                      Entregar
                    </button>
                    <button onClick={async () => { await updateOrderApi(o.id, { status: 'cancelled' }); await center.syncWithBackend(); }}
                      className="text-[10px] px-2 py-0.5 rounded-md border border-border hover:bg-destructive/10">
                      Cancelar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
