import React, { useEffect, useState, useRef } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { fetchOrders } from "@/lib/infra/ordersApi";

export function OrdersModal() {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const intervalRef = useRef<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    load();
    // start polling every 5s
    intervalRef.current = window.setInterval(() => {
      if (!mounted) return;
      load();
    }, 5000);
    return () => {
      mounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-3 py-1.5 rounded bg-secondary/60 hover:bg-secondary text-xs">Pedidos</button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Pedidos do Sistema</DialogTitle>
        <DialogDescription>Lista de pedidos sincronizados com o backend.</DialogDescription>

        <div className="mt-4 space-y-3">
          {loading && <div className="text-sm text-muted-foreground">Carregando...</div>}
          {!loading && orders.length === 0 && <div className="text-sm text-muted-foreground">Nenhum pedido encontrado.</div>}
          {!loading && orders.length > 0 && (
            <div className="grid gap-2 max-h-80 overflow-auto">
              {orders.map((o) => (
                <div key={o.id} className="p-3 border rounded bg-secondary/5 flex justify-between items-start">
                  <div>
                    <div className="font-mono text-xs text-muted-foreground">{o.id}</div>
                    <div className="font-medium">{o.customer}</div>
                    <div className="text-sm text-muted-foreground">{o.address}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{o.priority}</div>
                    <button onClick={() => setSelected(o)} className="mt-2 px-2 py-1 text-xs rounded bg-primary text-primary-foreground">Ver</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selected && (
            <div className="mt-4 p-3 border rounded bg-background">
              <h3 className="font-semibold">Detalhes do Pedido {selected.id}</h3>
              <div className="text-sm text-muted-foreground">Cliente: {selected.customer}</div>
              <div className="text-sm text-muted-foreground">Endereço: {selected.address}</div>
              <div className="text-sm text-muted-foreground">Peso: {selected.weight} kg</div>
              <div className="text-sm text-muted-foreground">Prioridade: {selected.priority}</div>
              <div className="text-sm text-muted-foreground">Status: {selected.status}</div>
              <div className="text-sm text-muted-foreground">Drone: {selected.drone_id ?? '—'}</div>
              <div className="text-xs text-muted-foreground mt-2">Criado em: {new Date(selected.created_at).toLocaleString()}</div>
              <div className="mt-3 text-right">
                <button onClick={() => setSelected(null)} className="px-2 py-1 rounded border">Fechar</button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OrdersModal;
