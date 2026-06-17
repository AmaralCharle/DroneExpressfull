import { useEffect, useState } from "react";
import { ControlCenter } from "@/lib/patterns/ControlCenter";

export function useControlCenter() {
  const center = ControlCenter.getInstance();
  const [state, setState] = useState(() => center.getSnapshot());

  useEffect(() => {
    const unsub = center.state$.subscribe(setState);
    const interval = setInterval(() => center.tick(), 250);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [center]);

  return { center, state };
}
