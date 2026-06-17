// Domain types for drones (used by Factory Method)
export type DroneType = "light" | "fast" | "heavy" | "medical";
export type DroneStatus = "idle" | "flying" | "returning" | "charging" | "maintenance";

export interface DroneState {
  id: string;
  name: string;
  type: DroneType;
  battery: number;
  speed: number; // km/h
  maxLoad: number; // kg
  status: DroneStatus;
  location: { x: number; y: number };
  currentOrderId?: string;
}

export abstract class Drone implements DroneState {
  id: string;
  name: string;
  abstract type: DroneType;
  abstract speed: number;
  abstract maxLoad: number;
  battery = 100;
  status: DroneStatus = "idle";
  location = { x: 50, y: 50 };
  currentOrderId?: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  toState(): DroneState {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      battery: this.battery,
      speed: this.speed,
      maxLoad: this.maxLoad,
      status: this.status,
      location: { ...this.location },
      currentOrderId: this.currentOrderId,
    };
  }
}

class LightDrone extends Drone {
  type: DroneType = "light";
  speed = 60;
  maxLoad = 2;
}
class FastDrone extends Drone {
  type: DroneType = "fast";
  speed = 110;
  maxLoad = 3;
}
class HeavyDrone extends Drone {
  type: DroneType = "heavy";
  speed = 45;
  maxLoad = 25;
}
class MedicalDrone extends Drone {
  type: DroneType = "medical";
  speed = 95;
  maxLoad = 5;
}

// Factory Method
export class DroneFactory {
  private static counter = 0;
  static create(type: DroneType): Drone {
    const id = `DRN-${String(++this.counter).padStart(3, "0")}`;
    switch (type) {
      case "light":
        return new LightDrone(id, "Skylark");
      case "fast":
        return new FastDrone(id, "Falcon");
      case "heavy":
        return new HeavyDrone(id, "Titan");
      case "medical":
        return new MedicalDrone(id, "Aegis");
    }
  }
}

export const DRONE_LABELS: Record<DroneType, string> = {
  light: "Drone Leve",
  fast: "Drone Rápido",
  heavy: "Carga Pesada",
  medical: "Médico Emergencial",
};
