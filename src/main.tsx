import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

function MirrorSbsRoot() {
  const [vrMode, setVrMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const root = document.documentElement;
    if (!document.fullscreenElement) {
      void root.requestFullscreen().catch(() => undefined);
      return;
    }
    void document.exitFullscreen().catch(() => undefined);
  };

  useEffect(() => {
    const { pushState, replaceState } = window.history;

    window.history.pushState = function patchedPushState(...args) {
      pushState.apply(window.history, args);
      window.dispatchEvent(new PopStateEvent("popstate"));
    };

    window.history.replaceState = function patchedReplaceState(...args) {
      replaceState.apply(window.history, args);
      window.dispatchEvent(new PopStateEvent("popstate"));
    };

    return () => {
      window.history.pushState = pushState;
      window.history.replaceState = replaceState;
    };
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    onFullscreenChange();
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (!vrMode) return;

    const leftPanel = document.getElementById("mirror-left");
    const rightPanel = document.getElementById("mirror-right");
    if (!leftPanel || !rightPanel) return;

    let syncingScroll = false;
    let pendingMirrorEvent: MouseEvent | WheelEvent | PointerEvent | null = null;
    let frameId = 0;
    const mirrorScroll = (source: HTMLElement, target: HTMLElement) => {
      if (syncingScroll) return;
      syncingScroll = true;
      target.scrollTop = source.scrollTop;
      target.scrollLeft = source.scrollLeft;
      // Reset in the synchronized frame loop.
    };

    const onLeftScroll = () => mirrorScroll(leftPanel, rightPanel);
    const onRightScroll = () => mirrorScroll(rightPanel, leftPanel);
    leftPanel.addEventListener("scroll", onLeftScroll, { passive: true });
    rightPanel.addEventListener("scroll", onRightScroll, { passive: true });

    const mouseEventTypes: Array<keyof DocumentEventMap> = [
      "mousemove",
      "mousedown",
      "mouseup",
      "click",
      "dblclick",
      "wheel",
      "contextmenu",
      "pointermove",
      "pointerdown",
      "pointerup",
    ];

    const mirrorEventNow = (event: MouseEvent | WheelEvent | PointerEvent) => {
      if (!event.isTrusted) return;

      const sourcePanel = (event.target as Element | null)?.closest(".sbs-panel") as HTMLElement | null;
      if (!sourcePanel) return;
      const targetPanel = sourcePanel.id === "mirror-left" ? rightPanel : leftPanel;

      const srcRect = sourcePanel.getBoundingClientRect();
      const dstRect = targetPanel.getBoundingClientRect();
      if (srcRect.width <= 0 || srcRect.height <= 0 || dstRect.width <= 0 || dstRect.height <= 0) return;

      const normX = (event.clientX - srcRect.left) / srcRect.width;
      const normY = (event.clientY - srcRect.top) / srcRect.height;
      const mirroredX = dstRect.left + normX * dstRect.width;
      const mirroredY = dstRect.top + normY * dstRect.height;

      const targetEl = document.elementFromPoint(mirroredX, mirroredY) as HTMLElement | null;
      if (!targetEl) return;

      if (event.type === "click" && event instanceof MouseEvent) {
        const clickedNavButton = (event.target as HTMLElement | null)?.closest("nav button") as HTMLButtonElement | null;
        if (clickedNavButton) {
          const buttonLabel = clickedNavButton.textContent?.trim();
          if (buttonLabel) {
            const mirroredNavButtons = Array.from(targetPanel.querySelectorAll("nav button")) as HTMLButtonElement[];
            const sameButton = mirroredNavButtons.find(
              (button) => button.textContent?.trim() === buttonLabel,
            );
            if (sameButton) {
              sameButton.click();
              return;
            }
          }
        }
      }

      const base = {
        bubbles: true,
        cancelable: true,
        clientX: mirroredX,
        clientY: mirroredY,
        screenX: event.screenX,
        screenY: event.screenY,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        metaKey: event.metaKey,
      };

      if (event instanceof WheelEvent) {
        targetEl.dispatchEvent(
          new WheelEvent(event.type, {
            ...base,
            deltaX: event.deltaX,
            deltaY: event.deltaY,
            deltaZ: event.deltaZ,
            deltaMode: event.deltaMode,
          }),
        );
        return;
      }

      if (event instanceof PointerEvent) {
        targetEl.dispatchEvent(
          new PointerEvent(event.type, {
            ...base,
            pointerId: event.pointerId,
            pointerType: event.pointerType,
            isPrimary: event.isPrimary,
            pressure: event.pressure,
            button: event.button,
            buttons: event.buttons,
          }),
        );
        return;
      }

      targetEl.dispatchEvent(
        new MouseEvent(event.type, {
          ...base,
          button: event.button,
          buttons: event.buttons,
          detail: event.detail,
        }),
      );
    };

    const highFrequencyEventTypes = new Set(["mousemove", "pointermove", "wheel"]);
    const enqueueOrMirrorEvent = (event: MouseEvent | WheelEvent | PointerEvent) => {
      if (!highFrequencyEventTypes.has(event.type)) {
        mirrorEventNow(event);
        return;
      }
      pendingMirrorEvent = event;
    };

    const animate = () => {
      const leftVideos = Array.from(leftPanel.querySelectorAll("video")) as HTMLVideoElement[];
      const rightVideos = Array.from(rightPanel.querySelectorAll("video")) as HTMLVideoElement[];
      const total = Math.min(leftVideos.length, rightVideos.length);

      // 1) Compute shared state once per frame (video and input deltas).
      for (let i = 0; i < total; i += 1) {
        const source = leftVideos[i];
        const target = rightVideos[i];

        if (target.muted !== source.muted) target.muted = source.muted;
        if (target.volume !== source.volume) target.volume = source.volume;
        if (target.playbackRate !== source.playbackRate) target.playbackRate = source.playbackRate;
        if (Math.abs(target.currentTime - source.currentTime) > 0.08) target.currentTime = source.currentTime;

        if (source.paused && !target.paused) {
          target.pause();
        } else if (!source.paused && target.paused) {
          void target.play().catch(() => undefined);
        }
      }

      // 2) Apply exactly once to both views in the same frame.
      if (pendingMirrorEvent) {
        mirrorEventNow(pendingMirrorEvent);
        pendingMirrorEvent = null;
      }

      syncingScroll = false;
      frameId = window.requestAnimationFrame(animate);
    };

    mouseEventTypes.forEach((eventType) => {
      document.addEventListener(eventType, enqueueOrMirrorEvent as EventListener, { passive: false });
    });

    frameId = window.requestAnimationFrame(animate);

    return () => {
      leftPanel.removeEventListener("scroll", onLeftScroll);
      rightPanel.removeEventListener("scroll", onRightScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
      mouseEventTypes.forEach((eventType) => {
        document.removeEventListener(eventType, enqueueOrMirrorEvent as EventListener);
      });
    };
  }, [vrMode]);

  return (
    <div id="mirror-body" className={vrMode ? "sbs-active" : ""}>
      <button
        type="button"
        className="vr-probe-button"
        onClick={() => setVrMode((prev) => !prev)}
      >
        {vrMode ? "SALIR MODO VR" : "PROBAR MODO VR"}
      </button>
      <button
        type="button"
        className="fullscreen-button"
        onClick={toggleFullscreen}
      >
        {isFullscreen ? "SALIR FULLSCREEN" : "FULLSCREEN"}
      </button>

      <div className="sbs-panels">
        <div id="mirror-left" className="sbs-panel">
          <App />
        </div>
        {vrMode && (
          <div id="mirror-right" className="sbs-panel sbs-panel-right">
            <App />
          </div>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<MirrorSbsRoot />);
