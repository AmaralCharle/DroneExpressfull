// Observer pattern
export type Listener<T> = (event: T) => void;

export class Subject<T> {
  private listeners = new Set<Listener<T>>();
  subscribe(l: Listener<T>): () => void {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }
  notify(event: T) {
    this.listeners.forEach((l) => l(event));
  }
}

export type NotificationLevel = "info" | "success" | "warning" | "danger";
export interface Notification {
  id: string;
  level: NotificationLevel;
  title: string;
  message: string;
  timestamp: number;
}
