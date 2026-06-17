import { createFileRoute } from "@tanstack/react-router";
import { useControlCenter } from "@/hooks/useControlCenter";
import { DashHeader } from "@/components/drone/Header";
import { StatCard } from "@/components/drone/StatCard";
import { MapPanel } from "@/components/drone/MapPanel";
import { DroneList } from "@/components/drone/DroneList";
import { OrderForm } from "@/components/drone/OrderForm";
import { NotificationsPanel } from "@/components/drone/NotificationsPanel";
import { OrdersTable } from "@/components/drone/OrdersTable";
import { RouteStrategies } from "@/components/drone/RouteStrategies";
import { PatternsLegend } from "@/components/drone/PatternsLegend";
import { Plane, Package, Activity, BatteryCharging } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DroneExpress — Central Inteligente de Entregas" },
      { name: "description", content: "Dashboard futurista de delivery com drones autônomos. Demonstração de Design Patterns." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { state } = useControlCenter();
  const flying = state.drones.filter((d) => d.status === "flying").length;
  const returning = state.drones.filter((d) => d.status === "returning").length;
  const avgBattery = state.drones.length
    ? state.drones.reduce((a, d) => a + d.battery, 0) / state.drones.length : 0;
  const todayOrders = state.orders.length;

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-5">
      <DashHeader weather={state.weather} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Drones em Voo" value={flying} sub={`${returning} retornando`} icon={<Plane className="size-7" />} accent="primary" />
        <StatCard label="Entregas do Dia" value={todayOrders} sub={`${state.delivered} concluídas`} icon={<Package className="size-7" />} accent="info" />
        <StatCard label="Taxa de Sucesso" value={`${state.successRate}%`} sub="últimas 24h" icon={<Activity className="size-7" />} accent="success" />
        <StatCard label="Bateria Média" value={`${avgBattery.toFixed(0)}%`} sub={`${state.drones.length} drones ativos`} icon={<BatteryCharging className="size-7" />} accent="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <MapPanel drones={state.drones.map((d) => d.toState())} orders={state.orders} weather={state.weather} />
          <OrdersTable orders={state.orders} />
          <div className="grid md:grid-cols-2 gap-5">
            <RouteStrategies />
            <PatternsLegend />
          </div>
        </div>

        <div className="space-y-5">
          <OrderForm />
          <DroneList drones={state.drones.map((d) => d.toState())} />
          <NotificationsPanel items={state.notifications} />
        </div>
      </div>

      <footer className="text-center text-[11px] text-muted-foreground font-mono pt-4">
        DroneExpress • Protótipo acadêmico • Singleton · Factory · Strategy · Observer · Command
      </footer>
    </div>
  );
}
