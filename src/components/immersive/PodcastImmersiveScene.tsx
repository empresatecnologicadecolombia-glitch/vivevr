import { Billboard, Html } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { SRGBColorSpace } from "three";
import { Button } from "@/components/ui/button";
import {
  EquirectangularInterior,
  ImmersiveOrbitControls,
  SPHERE_RADIUS,
} from "@/components/immersive/equirectSphereCore";
import { resolvePodcastVideoId, type StreamerProfile } from "@/data/podcastStreamers";

type ReactionKind = "risas" | "aplausos" | "epico";

const reactionConfig: Record<ReactionKind, { label: string; emoji: string }> = {
  risas: { label: "Risas", emoji: "😂" },
  aplausos: { label: "Aplausos", emoji: "👏" },
  epico: { label: "Epico", emoji: "🔥" },
};

function makeButtonTexture(emoji: string, label: string) {
  const w = 512;
  const h = 220;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "rgba(15,23,42,0.92)");
  g.addColorStop(1, "rgba(30,41,59,0.88)");
  ctx.fillStyle = g;
  const r = 28;
  const x = 8;
  const y = 8;
  const rw = w - 16;
  const rh = h - 16;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + rw - r, y);
  ctx.quadraticCurveTo(x + rw, y, x + rw, y + r);
  ctx.lineTo(x + rw, y + rh - r);
  ctx.quadraticCurveTo(x + rw, y + rh, x + rw - r, y + rh);
  ctx.lineTo(x + r, y + rh);
  ctx.quadraticCurveTo(x, y + rh, x, y + rh - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(34,211,238,0.55)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.font = "bold 72px 'Segoe UI Emoji', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(emoji, w / 2, 110);
  ctx.font = "bold 38px ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = "rgba(226,232,240,0.95)";
  ctx.fillText(label, w / 2, 178);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function SpatialReactionButtons({
  onReaction,
}: {
  onReaction: (k: ReactionKind) => void;
}) {
  const kinds = useMemo(() => Object.keys(reactionConfig) as ReactionKind[], []);
  const textures = useMemo(
    () =>
      kinds.map((k) => {
        const { emoji, label } = reactionConfig[k];
        return makeButtonTexture(emoji, label);
      }),
    [kinds],
  );

  const positions: [number, number, number][] = [
    [-2.85, -0.28, -4.55],
    [0, -0.38, -4.3],
    [2.85, -0.28, -4.55],
  ];

  return (
    <>
      {kinds.map((kind, i) => (
        <Billboard key={kind} position={positions[i]} follow>
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              onReaction(kind);
            }}
            onPointerOver={() => {
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <planeGeometry args={[2.25, 0.96]} />
            <meshBasicMaterial map={textures[i]} transparent opacity={0.98} depthTest depthWrite={false} />
          </mesh>
        </Billboard>
      ))}
    </>
  );
}

function FloatingEmojiBurst({
  emoji,
  onDone,
}: {
  emoji: string;
  onDone: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const doneRef = useRef(false);
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(c);
    ctx.font = "200px 'Segoe UI Emoji', system-ui, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, 128, 140);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.needsUpdate = true;
    return t;
  }, [emoji]);
  const t = useRef(0);
  const xOff = useMemo(() => 0.35 + Math.random() * 0.5, []);
  useFrame((_, delta) => {
    t.current += delta;
    if (group.current) {
      group.current.position.y += delta * 1.8;
      const s = 1 + t.current * 0.35;
      group.current.scale.setScalar(s);
    }
    const mat = meshRef.current?.material as THREE.MeshBasicMaterial | undefined;
    if (mat) {
      mat.opacity = Math.max(0, 1 - t.current / 1.35);
    }
    if (t.current > 1.35 && !doneRef.current) {
      doneRef.current = true;
      onDone();
    }
  });
  return (
    <group ref={group} position={[xOff, 0.35, -4.35]}>
      <Billboard follow>
        <mesh ref={meshRef}>
          <planeGeometry args={[1.15, 1.15]} />
          <meshBasicMaterial map={tex} transparent opacity={1} depthWrite={false} />
        </mesh>
      </Billboard>
    </group>
  );
}

function SceneContent({
  streamer,
  panoramaUrl,
  embedUrl,
  isPremiumLive,
  messages,
  chatInput,
  onChatInput,
  onSendChat,
  onReaction,
  bursts,
  onBurstDone,
}: {
  streamer: StreamerProfile;
  panoramaUrl: string;
  embedUrl: string;
  isPremiumLive: boolean;
  messages: string[];
  chatInput: string;
  onChatInput: (v: string) => void;
  onSendChat: () => void;
  onReaction: (k: ReactionKind) => void;
  bursts: Array<{ id: number; kind: ReactionKind }>;
  onBurstDone: (id: number) => void;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <EquirectangularInterior url={panoramaUrl} />
      </Suspense>

      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 10, 6]} intensity={0.35} />

      <Html position={[0, 1.35, -8.6]} transform distanceFactor={11} center style={{ width: "min(72vw, 620px)" }}>
        <div
          className="rounded-2xl border border-white/25 bg-black/50 p-2 shadow-[0_40px_120px_rgba(0,0,0,0.85)] backdrop-blur-md"
          style={{ pointerEvents: "auto" }}
        >
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black">
            {isPremiumLive ? (
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 bg-background/95 p-4 text-center">
                <p className="font-display text-lg font-bold text-foreground">En vivo premium</p>
                <p className="text-xs text-muted-foreground">Desbloquea con ticket Grada o VIP.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button variant="heroOutline" size="sm">
                    Grada (${streamer.ticketGrada.toFixed(2)})
                  </Button>
                  <Button variant="hero" size="sm">
                    VIP (${streamer.ticketVip.toFixed(2)})
                  </Button>
                </div>
              </div>
            ) : (
              <iframe
                title={streamer.loungeTitle}
                src={embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="h-full w-full border-0"
              />
            )}
          </div>
        </div>
      </Html>

      <SpatialReactionButtons onReaction={onReaction} />

      <Html position={[5.45, 0.82, -7.2]} transform distanceFactor={7.6} style={{ width: "min(92vw, 290px)" }}>
        <div
          className="flex max-h-[48vh] flex-col rounded-2xl border border-white/20 bg-black/40 p-3 shadow-xl backdrop-blur-2xl"
          style={{ pointerEvents: "auto" }}
        >
          <p className="mb-2 border-b border-white/10 pb-2 text-[10px] font-display uppercase tracking-[0.2em] text-cyan-300">
            Chat
          </p>
          <div className="min-h-0 flex-1 space-y-1 overflow-y-auto text-xs text-slate-200">
            {messages.map((m, i) => (
              <p key={`${i}-${m.slice(0, 10)}`}>● {m}</p>
            ))}
          </div>
          <div className="mt-2 flex gap-1 border-t border-white/10 pt-2">
            <input
              value={chatInput}
              onChange={(e) => onChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSendChat()}
              placeholder="Mensaje…"
              className="h-8 flex-1 rounded-lg border border-white/15 bg-black/50 px-2 text-xs text-white outline-none"
            />
            <Button type="button" size="sm" variant="heroOutline" className="h-8 shrink-0 px-2" onClick={onSendChat}>
              →
            </Button>
          </div>
        </div>
      </Html>

      <Html position={[5.7, 2.15, -7.55]} transform distanceFactor={8.2} style={{ width: "min(88vw, 250px)" }}>
        <div
          className="flex max-w-sm flex-col gap-2 rounded-2xl border border-cyan-500/35 bg-black/45 p-3 text-left shadow-lg backdrop-blur-xl"
          style={{ pointerEvents: "auto" }}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">Lobby Sync</p>
          <p className="text-xs text-slate-200">{messages.length} mensajes activos</p>
          <p className="text-[11px] text-slate-400">Conectado a la sala global en tiempo real.</p>
        </div>
      </Html>

      <Html position={[-4.8, 2.45, -7.2]} transform distanceFactor={9.2}>
        <div
          className="flex max-w-sm flex-col gap-2 rounded-2xl border border-cyan-500/30 bg-black/55 p-3 text-left shadow-lg backdrop-blur-xl"
          style={{ pointerEvents: "auto" }}
        >
          <Link
            to="/podcast-hub"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/45 px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-wider text-cyan-100"
          >
            ← Podcast Hub
          </Link>
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-primary">{streamer.immersiveSalaName}</p>
            <p className="font-display text-base font-bold text-white">{streamer.name}</p>
            <p className="text-[11px] text-slate-400">{streamer.loungeDescription}</p>
          </div>
        </div>
      </Html>

      {bursts.map((b) => (
        <FloatingEmojiBurst
          key={b.id}
          emoji={reactionConfig[b.kind].emoji}
          onDone={() => onBurstDone(b.id)}
        />
      ))}
    </>
  );
}

export interface PodcastImmersiveSceneProps {
  streamer: StreamerProfile;
  messages: string[];
  chatInput: string;
  onChatInput: (v: string) => void;
  onSendChat: () => void;
  onReaction: (k: ReactionKind) => void;
  bursts: Array<{ id: number; kind: ReactionKind }>;
  onBurstDone: (id: number) => void;
}

export default function PodcastImmersiveScene({
  streamer,
  messages,
  chatInput,
  onChatInput,
  onSendChat,
  onReaction,
  bursts,
  onBurstDone,
}: PodcastImmersiveSceneProps) {
  const panoramaUrl = streamer.panoramaImage.trim();
  const videoId = resolvePodcastVideoId(streamer);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;
  const isPremiumLive = streamer.status === "live" && streamer.streamType === "platform";

  const onPointerMissed = useCallback(() => {}, []);

  return (
    <div className="h-[100dvh] w-full touch-none bg-black [&_*]:outline-none" style={{ touchAction: "none" }}>
      <Canvas
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 0.12], fov: 84, far: SPHERE_RADIUS * 2 }}
        onPointerMissed={onPointerMissed}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SceneContent
            streamer={streamer}
            panoramaUrl={panoramaUrl}
            embedUrl={embedUrl}
            isPremiumLive={isPremiumLive}
            messages={messages}
            chatInput={chatInput}
            onChatInput={onChatInput}
            onSendChat={onSendChat}
            onReaction={onReaction}
            bursts={bursts}
            onBurstDone={onBurstDone}
          />
        </Suspense>
        <ImmersiveOrbitControls />
      </Canvas>
    </div>
  );
}

export type { ReactionKind };
