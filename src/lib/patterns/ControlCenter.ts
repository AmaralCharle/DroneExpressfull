// Singleton Control Center
import { Drone, DroneFactory, DroneType } from "./Drone";
import { ROUTE_STRATEGIES, RouteStrategyKey } from "./RouteStrategy";
import { Subject, Notification } from "./Observer";
import { Command, TakeOffCommand, ReturnToBaseCommand, LandCommand, CancelDeliveryCommand } from "./Command";
import { fetchOrders, createOrderApi, updateOrderApi, fetchDrones, createDroneApi, sendDroneCommandApi } from "@/lib/infra/ordersApi";

export interface Order {
  id: string;
  customer: string;
  address: string;
  weight: number;
  priority: "low" | "normal" | "high" | "critical";
  status: "pending" | "assigned" | "in_transit" | "delivered" | "cancelled";
  createdAt: number;
  droneId?: string;
  route: RouteStrategyKey;
  destination: { x: number; y: number };
}

export type Weather = "clear" | "windy" | "rainy" | "storm";

interface CenterState {
  drones: Drone[];
  orders: Order[];
  notifications: Notification[];
  weather: Weather;
  delivered: number;
  successRate: number;
}

export class ControlCenter {
  private static instance: ControlCenter;
  private drones: Drone[] = [];
  private orders: Order[] = [];
  private notifications: Notification[] = [];
  private weather: Weather = "clear";
  private delivered = 0;
  private failed = 0;
  private orderCounter = 0;
  readonly state$ = new Subject<CenterState>();
  readonly notification$ = new Subject<Notification>();

  private constructor() {
    // Seed
    [
      DroneFactory.create("light"),
      DroneFactory.create("fast"),
      DroneFactory.create("heavy"),
      DroneFactory.create("medical"),
      DroneFactory.create("light"),
      DroneFactory.create("fast"),
    ].forEach((d) => {
      d.location = { x: 48 + Math.random() * 6, y: 48 + Math.random() * 6 };
      d.battery = 70 + Math.random() * 30;
      this.drones.push(d);
    });

    // Try to sync existing orders and drones from backend
    (async () => {
      try {
        const rows = await fetchOrders();
        // map created_at strings to number timestamps
        this.orders = (rows || []).map((r: any) => ({
          id: r.id,
          customer: r.customer,
          address: r.address,
          weight: Number(r.weight),
          priority: r.priority,
          status: r.status,
          createdAt: r.created_at ? Date.parse(r.created_at) : Date.now(),
          droneId: r.drone_id ?? undefined,
          route: r.route ?? "fastest",
          destination: { x: Number(r.destination_x) || 50, y: Number(r.destination_y) || 50 },
        }));
        // fetch drones
        try {
          const dr = await fetchDrones();
          this.drones = (dr || []).map((d: any) => {
            const inst = DroneFactory.create(d.type as any);
            inst.id = d.id;
            inst.name = d.name ?? inst.name;
            inst.battery = Number(d.battery ?? inst.battery);
            inst.status = d.status ?? inst.status;
            inst.location = { x: Number(d.location?.x ?? d.location_x ?? 50), y: Number(d.location?.y ?? d.location_y ?? 50) };
            inst.currentOrderId = d.currentOrderId ?? d.current_order_id ?? undefined;
            return inst;
          });
        } catch (e) {}
        this.emit();
      } catch (e) {
        // ignore sync failure
      }
    })();
  }

  static getInstance(): ControlCenter {
    if (!ControlCenter.instance) ControlCenter.instance = new ControlCenter();
    return ControlCenter.instance;
  }

  getSnapshot(): CenterState {
    const total = this.delivered + this.failed;
    return {
      drones: this.drones,
      orders: this.orders,
      notifications: this.notifications,
      weather: this.weather,
      delivered: this.delivered,
      successRate: total === 0 ? 100 : Math.round((this.delivered / total) * 100),
    };
  }

  async syncWithBackend() {
    try {
      const rows = await fetchOrders();
      this.orders = (rows || []).map((r: any) => ({
        id: r.id,
        customer: r.customer,
        address: r.address,
        weight: Number(r.weight),
        priority: r.priority,
        status: r.status,
        createdAt: r.created_at ? Date.parse(r.created_at) : Date.now(),
        droneId: r.drone_id ?? undefined,
        route: r.route ?? 'fastest',
        destination: { x: Number(r.destination_x) || 50, y: Number(r.destination_y) || 50 },
      }));
    } catch (e) {
      // ignore
    }
    try {
      const dr = await fetchDrones();
      this.drones = (dr || []).map((d: any) => {
        const inst = DroneFactory.create(d.type as any);
        inst.id = d.id;
        inst.name = d.name ?? inst.name;
        inst.battery = Number(d.battery ?? inst.battery);
        inst.status = d.status ?? inst.status;
        inst.location = { x: Number(d.location?.x ?? d.location_x ?? 50), y: Number(d.location?.y ?? d.location_y ?? 50) };
        inst.currentOrderId = d.currentOrderId ?? d.current_order_id ?? undefined;
        return inst;
      });
    } catch (e) {
      // ignore
    }
    this.emit();
  }

  private emit() {
    this.state$.notify(this.getSnapshot());
  }

  notify(level: Notification["level"], title: string, message: string) {
    const n: Notification = {
      id: `N-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      level, title, message, timestamp: Date.now(),
    };
    this.notifications = [n, ...this.notifications].slice(0, 30);
    this.notification$.notify(n);
    this.emit();
  }

  setWeather(w: Weather) {
    this.weather = w;
    this.notify(w === "storm" ? "danger" : w === "rainy" ? "warning" : "info",
      "Clima atualizado", `Condição: ${w.toUpperCase()}`);
  }

  addDrone(type: DroneType) {
    const d = DroneFactory.create(type);
    d.location = { x: 50, y: 50 };
    this.drones.push(d);
    this.notify("info", "Drone adicionado", `${d.id} (${d.name}) pronto na base.`);
    // persist to backend
    createDroneApi({ id: d.id, name: d.name, type: d.type, battery: d.battery, speed: d.speed, maxLoad: d.maxLoad, status: d.status, location: d.location }).catch(() => {});
  }

  executeCommand(droneId: string, cmd: Command) {
    const d = this.drones.find((x) => x.id === droneId);
    if (!d) return;
    cmd.execute(d);
    this.notify("info", `Comando: ${cmd.name}`, `${d.id} executou "${cmd.name}".`);
    // send command to backend to keep state (map command classes to keys)
    let key = cmd.name.toLowerCase();
    if (cmd instanceof TakeOffCommand) key = 'takeoff';
    else if (cmd instanceof LandCommand) key = 'land';
    else if (cmd instanceof ReturnToBaseCommand) key = 'return';
    else if (cmd instanceof CancelDeliveryCommand) key = 'cancel';
    sendDroneCommandApi(droneId, { command: key }).catch(() => {});
  }

  createOrder(input: Omit<Order, "id" | "status" | "createdAt" | "destination"> & { route: RouteStrategyKey }) {
    const localId = `ORD-${String(++this.orderCounter).padStart(4, "0")}`;
    const order: Order = {
      ...input,
      id: localId,
      status: "pending",
      createdAt: Date.now(),
      destination: { x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 },
    };
    // optimistically add locally
    this.orders = [order, ...this.orders];
    this.notify("info", "Pedido enviado", `${order.id} • ${order.customer}`);
    // send to backend (fire-and-forget)
    createOrderApi({ ...input, id: localId }).then((created: any) => {
      // update local record with backend values (created_at, ids)
      const idx = this.orders.findIndex((o) => o.id === localId);
      if (idx !== -1) {
        this.orders[idx] = {
          ...this.orders[idx],
          createdAt: created.created_at ? Date.parse(created.created_at) : this.orders[idx].createdAt,
          droneId: created.drone_id ?? this.orders[idx].droneId,
        };
        this.emit();
      }
    }).catch(() => { /* ignore */ });
    this.dispatch(order);
  }

  private dispatch(order: Order) {
    const drone = this.drones.find(
      (d) => d.status === "idle" && d.maxLoad >= order.weight && d.battery > 30,
    );
    if (!drone) {
      this.notify("warning", "Sem drone disponível", `${order.id} aguardando.`);
      return;
    }
    order.status = "in_transit";
    order.droneId = drone.id;
    drone.currentOrderId = order.id;
    new TakeOffCommand().execute(drone);
    // persist assignment to backend
    try {
      updateOrderApi(order.id, { status: order.status, drone_id: order.droneId }).catch(() => {});
    } catch {}
    const strategy = ROUTE_STRATEGIES[order.route];
    const dist = Math.hypot(order.destination.x - drone.location.x, order.destination.y - drone.location.y) / 5;
    const r = strategy.calculate(dist, drone.speed);
    this.notify("success", "Drone saiu da base",
      `${drone.id} • ${strategy.label} • ETA ${r.etaMin.toFixed(1)}min`);
  }

  // Simulation tick
  tick() {
    this.drones.forEach((d) => {
      if (d.status === "flying" && d.currentOrderId) {
        const order = this.orders.find((o) => o.id === d.currentOrderId);
        if (!order) return;
        const dx = order.destination.x - d.location.x;
        const dy = order.destination.y - d.location.y;
        const dist = Math.hypot(dx, dy);
        const speedFactor = this.weather === "storm" ? 0.4 : this.weather === "rainy" ? 0.7 : 1;
        const step = Math.min(dist, 1.5 * speedFactor);
        if (dist < 0.5) {
          order.status = "delivered";
          this.delivered++;
          d.status = "returning";
          d.currentOrderId = undefined;
          this.notify("success", "Entrega concluída", `${order.id} • ${order.customer}`);
        } else {
          d.location.x += (dx / dist) * step;
          d.location.y += (dy / dist) * step;
          d.battery = Math.max(0, d.battery - 0.4);
        }
      } else if (d.status === "returning") {
        const dx = 50 - d.location.x;
        const dy = 50 - d.location.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.5) {
          d.status = "charging";
          this.notify("info", "Drone retornando", `${d.id} chegou à base.`);
        } else {
          d.location.x += (dx / dist) * 1.2;
          d.location.y += (dy / dist) * 1.2;
          d.battery = Math.max(0, d.battery - 0.2);
        }
      } else if (d.status === "charging") {
        d.battery = Math.min(100, d.battery + 1.2);
        if (d.battery >= 99) d.status = "idle";
      }
      if (d.battery < 20 && d.status === "flying") {
        this.notify("warning", "Bateria baixa", `${d.id} com ${d.battery.toFixed(0)}%`);
      }
    });
    // Random weather events
    if (Math.random() < 0.005) {
      const opts: Weather[] = ["clear", "windy", "rainy", "storm"];
      const next = opts[Math.floor(Math.random() * opts.length)];
      if (next !== this.weather) this.setWeather(next);
    }
    this.emit();
  }
}
