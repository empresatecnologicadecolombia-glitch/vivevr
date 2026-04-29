import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import App from "./App.tsx";
import "./index.css";

function MirrorSbsRoot() {
  const [vrMode, setVrMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const lensMapRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const sourceHostRef = useRef<HTMLDivElement | null>(null);
  const masterCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const leftEyeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rightEyeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const leftEyeRef = useRef<HTMLDivElement | null>(null);
  const rightEyeRef = useRef<HTMLDivElement | null>(null);
  const VR_LENS_STRENGTH = 0.5;

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
    const map = lensMapRef.current;
    if (!map) return;
    // Match the user's shader scale intention in a DOM-safe filter.
    map.setAttribute("scale", String(Math.max(0, Math.min(1.2, VR_LENS_STRENGTH)) * 44));
  }, []);

  useEffect(() => {
    document.body.classList.toggle("vr-mode-active", vrMode);
    return () => document.body.classList.remove("vr-mode-active");
  }, [vrMode]);

  useEffect(() => {
    if (!vrMode) {
      setHasFrame(false);
      return;
    }

    const sourceHost = sourceHostRef.current;
    const masterCanvas = masterCanvasRef.current;
    const leftCanvas = leftEyeCanvasRef.current;
    const rightCanvas = rightEyeCanvasRef.current;
    if (!sourceHost || !masterCanvas || !leftCanvas || !rightCanvas) return;

    const masterCtx = masterCanvas.getContext("2d", { alpha: false });
    const leftCtx = leftCanvas.getContext("2d", { alpha: false });
    const rightCtx = rightCanvas.getContext("2d", { alpha: false });
    if (!masterCtx || !leftCtx || !rightCtx) return;

    let rafId = 0;
    let framePainted = false;

    const syncCanvasSize = (canvas: HTMLCanvasElement) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(2, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(2, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const drawEye = (ctx: CanvasRenderingContext2D, target: HTMLCanvasElement) => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, target.width, target.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(masterCanvas, 0, 0, masterCanvas.width, masterCanvas.height, 0, 0, target.width, target.height);
    };

    let captureInFlight = false;
    const render = () => {
      syncCanvasSize(leftCanvas);
      syncCanvasSize(rightCanvas);
      if (!captureInFlight) {
        captureInFlight = true;
        void html2canvas(sourceHost, {
          backgroundColor: "#000000",
          useCORS: true,
          scale: 1,
          logging: false,
        })
          .then((snapshot) => {
            if (masterCanvas.width !== snapshot.width || masterCanvas.height !== snapshot.height) {
              masterCanvas.width = snapshot.width;
              masterCanvas.height = snapshot.height;
            }

            masterCtx.clearRect(0, 0, masterCanvas.width, masterCanvas.height);
            masterCtx.drawImage(snapshot, 0, 0, masterCanvas.width, masterCanvas.height);
            drawEye(leftCtx, leftCanvas);
            drawEye(rightCtx, rightCanvas);

            if (!framePainted) {
              framePainted = true;
              setHasFrame(true);
            }
          })
          .finally(() => {
            captureInFlight = false;
          });
      }

      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(rafId);
  }, [vrMode]);

  useEffect(() => {
    if (!vrMode || !hasFrame) return;

    const sourceHost = sourceHostRef.current;
    const leftEye = leftEyeRef.current;
    const rightEye = rightEyeRef.current;
    if (!sourceHost || !leftEye || !rightEye) return;

    const forwardPointer = (event: PointerEvent | MouseEvent | WheelEvent, eye: HTMLElement) => {
      const eyeRect = eye.getBoundingClientRect();
      const sourceRect = sourceHost.getBoundingClientRect();
      if (eyeRect.width <= 0 || eyeRect.height <= 0 || sourceRect.width <= 0 || sourceRect.height <= 0) return;

      const normX = (event.clientX - eyeRect.left) / eyeRect.width;
      const normY = (event.clientY - eyeRect.top) / eyeRect.height;
      const sourceX = sourceRect.left + normX * sourceRect.width;
      const sourceY = sourceRect.top + normY * sourceRect.height;

      const panels = document.querySelectorAll(".sbs-eye, .sbs-eye-canvas");
      panels.forEach((el) => ((el as HTMLElement).style.pointerEvents = "none"));
      const rawTarget = document.elementFromPoint(sourceX, sourceY) as HTMLElement | null;
      panels.forEach((el) => ((el as HTMLElement).style.pointerEvents = "auto"));
      if (!rawTarget) return;

      const interactiveTarget =
        rawTarget.closest("button, a, [role='button'], input, select, textarea, label") ??
        rawTarget;

      const findScrollableAncestor = (el: HTMLElement | null) => {
        let node: HTMLElement | null = el;
        while (node && node !== sourceHost) {
          const style = window.getComputedStyle(node);
          const canScrollY =
            (style.overflowY === "auto" || style.overflowY === "scroll") &&
            node.scrollHeight > node.clientHeight;
          const canScrollX =
            (style.overflowX === "auto" || style.overflowX === "scroll") &&
            node.scrollWidth > node.clientWidth;
          if (canScrollY || canScrollX) return node;
          node = node.parentElement;
        }
        return sourceHost;
      };

      if (event.type === "click") {
        interactiveTarget.click();
        return;
      }

      if (event instanceof WheelEvent) {
        const scrollHost = findScrollableAncestor(rawTarget);
        scrollHost.scrollTop += event.deltaY;
        scrollHost.scrollLeft += event.deltaX;
        interactiveTarget.dispatchEvent(
          new WheelEvent("wheel", {
            bubbles: true,
            cancelable: true,
            clientX: sourceX,
            clientY: sourceY,
            deltaX: event.deltaX,
            deltaY: event.deltaY,
            deltaZ: event.deltaZ,
            deltaMode: event.deltaMode,
          }),
        );
        return;
      }

      if (event instanceof PointerEvent) {
        interactiveTarget.dispatchEvent(
          new PointerEvent(event.type, {
            bubbles: true,
            cancelable: true,
            clientX: sourceX,
            clientY: sourceY,
            pointerId: event.pointerId,
            pointerType: event.pointerType,
            isPrimary: event.isPrimary,
            pressure: event.pressure,
            button: event.button,
            buttons: event.buttons,
          }),
        );
      }

      const type = event.type === "pointerdown" ? "mousedown" : event.type === "pointerup" ? "mouseup" : "mousemove";
      interactiveTarget.dispatchEvent(
        new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          clientX: sourceX,
          clientY: sourceY,
          button: (event as MouseEvent).button ?? 0,
          buttons: (event as MouseEvent).buttons ?? 1,
        }),
      );
    };

    const bindEye = (eye: HTMLElement) => {
      const onPointerDown = (e: PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        forwardPointer(e, eye);
      };
      const onPointerUp = (e: PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        forwardPointer(e, eye);
      };
      const onClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        forwardPointer(e, eye);
      };
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
        forwardPointer(e, eye);
      };

      eye.addEventListener("pointerdown", onPointerDown, { passive: false });
      eye.addEventListener("pointerup", onPointerUp, { passive: false });
      eye.addEventListener("click", onClick, { passive: false });
      eye.addEventListener("wheel", onWheel, { passive: false });

      return () => {
        eye.removeEventListener("pointerdown", onPointerDown);
        eye.removeEventListener("pointerup", onPointerUp);
        eye.removeEventListener("click", onClick);
        eye.removeEventListener("wheel", onWheel);
      };
    };

    const unbindLeft = bindEye(leftEye);
    const unbindRight = bindEye(rightEye);
    return () => {
      unbindLeft();
      unbindRight();
    };
  }, [vrMode, hasFrame]);

  return (
    <div id="mirror-body" className={`${vrMode ? "sbs-active" : ""} ${vrMode && hasFrame ? "sbs-ready" : ""}`}>
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="vr-lens-defs">
        <defs>
          <radialGradient id="vrDistortionGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(128,128,128)" />
            <stop offset="65%" stopColor="rgb(170,170,128)" />
            <stop offset="100%" stopColor="rgb(216,216,128)" />
          </radialGradient>
          <filter id="vr-distortion" x="-10%" y="-10%" width="120%" height="120%">
            <feImage
              href={`data:image/svg+xml;utf8,${encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="100%" height="100%" fill="url(%23vrDistortionGradient)"/><defs><radialGradient id="vrDistortionGradient" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgb(128,128,128)"/><stop offset="65%" stop-color="rgb(170,170,128)"/><stop offset="100%" stop-color="rgb(216,216,128)"/></radialGradient></defs></svg>',
              )}`}
              x="0"
              y="0"
              width="100%"
              height="100%"
              result="lensMap"
              preserveAspectRatio="none"
            />
            <feDisplacementMap
              ref={lensMapRef}
              in="SourceGraphic"
              in2="lensMap"
              scale="22"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <button
        type="button"
        className="vr-probe-button"
        onClick={() => setVrMode((prev) => !prev)}
      >
        {vrMode ? "SALIR VR MODE" : "VR MODE"}
      </button>
      <button
        type="button"
        className="fullscreen-button"
        onClick={toggleFullscreen}
      >
        {isFullscreen ? "SALIR FULLSCREEN" : "FULLSCREEN"}
      </button>

      <div className="sbs-panels">
        <div id="mirror-source" ref={sourceHostRef} className="sbs-source">
          <App />
        </div>
        <canvas ref={masterCanvasRef} className="sbs-master-canvas" aria-hidden="true" />
        {vrMode && <div className="sbs-vr-backdrop" aria-hidden="true" />}
        {vrMode && (
          <>
            <div className="sbs-eye" ref={leftEyeRef}>
              <canvas ref={leftEyeCanvasRef} className="sbs-eye-canvas" aria-hidden="true" />
            </div>
            <div className="sbs-eye" ref={rightEyeRef}>
              <canvas ref={rightEyeCanvasRef} className="sbs-eye-canvas" aria-hidden="true" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<MirrorSbsRoot />);
