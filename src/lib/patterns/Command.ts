// Command pattern
import type { Drone } from "./Drone";

export interface Command {
  name: string;
  execute(drone: Drone): void;
}

export class TakeOffCommand implements Command {
  name = "Iniciar Voo";
  execute(d: Drone) {
    d.status = "flying";
  }
}
export class LandCommand implements Command {
  name = "Pousar";
  execute(d: Drone) {
    d.status = "idle";
  }
}
export class CancelDeliveryCommand implements Command {
  name = "Cancelar Entrega";
  execute(d: Drone) {
    d.currentOrderId = undefined;
    d.status = "returning";
  }
}
export class ReturnToBaseCommand implements Command {
  name = "Retornar à Base";
  execute(d: Drone) {
    d.status = "returning";
    d.currentOrderId = undefined;
  }
}
