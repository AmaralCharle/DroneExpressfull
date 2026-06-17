import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { fetchOrders } from "@/lib/infra/ordersApi";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Pedidos — DroneExpress" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-5">
      <div className="glass rounded-2xl p-5">
        <h2 className="font-display text-lg">Pedidos</h2>
        <p className="text-sm text-muted-foreground">Lista completa de pedidos sincronizados com o backend.</p>
        <div className="mt-4">
          {loading && <div>Carregando...</div>}
          {!loading && orders.length === 0 && <div className="text-muted-foreground">Nenhum pedido encontrado.</div>}
          {!loading && orders.length > 0 && (
            <div className="overflow-auto max-h-[60vh]">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground border-b border-border">
                  <tr>
                    <th className="py-2 px-2 text-left">ID</th>
                    <th className="py-2 px-2 text-left">Cliente</th>
                    <th className="py-2 px-2 text-left">Endereço</th>
                    <th className="py-2 px-2 text-left">Peso</th>
                    <th className="py-2 px-2 text-left">Status</th>
                    <th className="py-2 px-2 text-left">Drone</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-border/40">
                      <td className="py-2 px-2 font-mono text-primary">{o.id}</td>
                      <td className="py-2 px-2">{o.customer}</td>
                      <td className="py-2 px-2">{o.address}</td>
                      <td className="py-2 px-2">{o.weight}kg</td>
                      <td className="py-2 px-2">{o.status}</td>
                      <td className="py-2 px-2">{o.drone_id ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
