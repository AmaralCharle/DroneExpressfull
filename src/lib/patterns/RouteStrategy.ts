// Strategy pattern for route calculation
export type RouteStrategyKey = "fastest" | "economic" | "safe" | "weather";

export interface RouteResult {
  distanceKm: number;
  etaMin: number;
  batteryCost: number;
  label: string;
}

export interface RouteStrategy {
  key: RouteStrategyKey;
  label: string;
  calculate(distanceKm: number, speedKmh: number): RouteResult;
}

class FastestRoute implements RouteStrategy {
  key: RouteStrategyKey = "fastest";
  label = "Rota Mais Rápida";
  calculate(d: number, s: number): RouteResult {
    return { distanceKm: d * 0.95, etaMin: (d * 0.95) / s * 60, batteryCost: d * 1.4, label: this.label };
  }
}
class EconomicRoute implements RouteStrategy {
  key: RouteStrategyKey = "economic";
  label = "Rota Econômica";
  calculate(d: number, s: number): RouteResult {
    return { distanceKm: d * 1.1, etaMin: (d * 1.1) / (s * 0.8) * 60, batteryCost: d * 0.7, label: this.label };
  }
}
class SafeRoute implements RouteStrategy {
  key: RouteStrategyKey = "safe";
  label = "Rota Segura";
  calculate(d: number, s: number): RouteResult {
    return { distanceKm: d * 1.2, etaMin: (d * 1.2) / (s * 0.85) * 60, batteryCost: d * 1.0, label: this.label };
  }
}
class WeatherRoute implements RouteStrategy {
  key: RouteStrategyKey = "weather";
  label = "Rota p/ Clima Adverso";
  calculate(d: number, s: number): RouteResult {
    return { distanceKm: d * 1.35, etaMin: (d * 1.35) / (s * 0.65) * 60, batteryCost: d * 1.6, label: this.label };
  }
}

export const ROUTE_STRATEGIES: Record<RouteStrategyKey, RouteStrategy> = {
  fastest: new FastestRoute(),
  economic: new EconomicRoute(),
  safe: new SafeRoute(),
  weather: new WeatherRoute(),
};
