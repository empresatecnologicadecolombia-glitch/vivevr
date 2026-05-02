import { useEffect, useState } from "react";

/**
 * True when `document.body` has `vr-mode-active` (mirror VR layout).
 */
export function useVrModeActive(): boolean {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const sync = () => setActive(document.body.classList.contains("vr-mode-active"));
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return active;
}
