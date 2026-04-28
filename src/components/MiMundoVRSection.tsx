import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { DeviceOrientationControls, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Maximize2, Minimize2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  getRoomMode,
  MI_MUNDO_ENV_STORAGE_KEY,
  normalizeStoredEnvironmentId,
  type MiMundoEnvironmentId,
} from "@/data/miMundoEnvironments";

/** Texturas Tierra alta resolucion (three.js, estilo vista espacial tipo Artemis); radio sin cambios. */
const PLANETS = "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets";
const EARTH_DAY_4K = `${PLANETS}/earth_day_4096.jpg`;
const EARTH_NORMAL = `${PLANETS}/earth_normal_2048.jpg`;
const EARTH_SPECULAR = `${PLANETS}/earth_specular_2048.jpg`;
const EARTH_CLOUDS = `${PLANETS}/earth_clouds_1024.png`;

/** Tierra y luna al 50% del tamano anterior. */
const CENTRAL_SPHERE_RADIUS = 0.925;
const CENTRAL_SPHERE_SEGMENTS = 120;

/** Textura ligera 360° de estadio de futbol (equirectangular, optimizada para mobile). */
const STADIUM_PANORAMA_URL =
  "/estadio.jpg";

/** Luna: textura ligera + parametros de orbita. */
const MOON_TEXTURE_URL = `${PLANETS}/moon_1024.jpg`;
const MOON_RADIUS = CENTRAL_SPHERE_RADIUS * 0.27;
const MOON_ORBIT_RADIUS = CENTRAL_SPHERE_RADIUS * 1.95;
const MOON_ORBIT_SPEED = 0.22;
const EARTH_ROTATION_SPEED = 0.08;
const FREE_MATCH_VIDEO_URL =
  (import.meta.env.VITE_FREE_MATCH_VIDEO_URL as string | undefined)?.trim() || "/CASAPARLANTE_ BEÉLE.mp4";
const SECOND_MATCH_VIDEO_URL =
  (import.meta.env.VITE_SECOND_MATCH_VIDEO_URL as string | undefined)?.trim() || "/videos/colombia-argentina-resumen.mp4";
const WINDOWS11_DESKTOP_URL =
  "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&w=1600&q=80";

type ScreenRefs = {
  main: React.RefObject<THREE.Mesh>;
  second: React.RefObject<THREE.Mesh>;
  social: React.RefObject<THREE.Mesh>;
  system: React.RefObject<THREE.Mesh>;
};

function createVideoTexture(url: string) {
  if (typeof document === "undefined") return { video: null, texture: null as THREE.VideoTexture | null };
  const video = document.createElement("video");
  video.src = url;
  video.crossOrigin = "anonymous";
  video.loop = true;
  video.muted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.preload = "auto";
  const texture = new THREE.VideoTexture(video);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return { video, texture };
}

function MoonScreenCluster({ visible, screenRefs }: { visible: boolean; screenRefs: ScreenRefs }) {
  const clusterRef = useRef<THREE.Group>(null);
  const [mainVideo] = useState(() => createVideoTexture(FREE_MATCH_VIDEO_URL));
  const [secondVideo] = useState(() => createVideoTexture(SECOND_MATCH_VIDEO_URL));
  const systemTexture = useLoader(THREE.TextureLoader, WINDOWS11_DESKTOP_URL);

  const socialTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bg.addColorStop(0, "rgba(18,34,55,0.95)");
    bg.addColorStop(1, "rgba(9,18,30,0.95)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(168, 232, 255, 0.6)";
    ctx.lineWidth = 5;
    ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);

    ctx.fillStyle = "rgba(210, 244, 255, 0.22)";
    ctx.fillRect(28, 32, canvas.width - 56, 68);

    ctx.font = "700 44px Arial";
    ctx.fillStyle = "#dbf4ff";
    ctx.fillText("SOCIAL GLASS", 44, 78);

    const items = [
      {
        label: "Facebook",
        color: "#1877f2",
        x: 70,
        y: 150,
        iconUrl: "https://cdn.simpleicons.org/facebook/ffffff",
      },
      {
        label: "WhatsApp",
        color: "#25D366",
        x: 350,
        y: 150,
        iconUrl: "https://cdn.simpleicons.org/whatsapp/ffffff",
      },
      {
        label: "Instagram",
        color: "#E4405F",
        x: 630,
        y: 150,
        iconUrl: "https://cdn.simpleicons.org/instagram/ffffff",
      },
      {
        label: "Spotify",
        color: "#1ED760",
        x: 210,
        y: 296,
        iconUrl: "https://cdn.simpleicons.org/spotify/ffffff",
      },
      {
        label: "TikTok",
        color: "#00f2ea",
        x: 490,
        y: 296,
        iconUrl: "https://cdn.simpleicons.org/tiktok/ffffff",
      },
    ];

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    const drawItem = (item: (typeof items)[number]) => {
      ctx.fillStyle = "rgba(240, 250, 255, 0.14)";
      ctx.beginPath();
      ctx.roundRect(item.x, item.y, 250, 110, 22);
      ctx.fill();
      ctx.strokeStyle = `${item.color}cc`;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = item.color;
      ctx.font = "700 28px Arial";
      ctx.fillText(item.label, item.x + 82, item.y + 66);
    };

    items.forEach(drawItem);

    // Cargar iconos oficiales y pintar encima de cada tarjeta.
    items.forEach((item) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.fillStyle = `${item.color}cc`;
        ctx.beginPath();
        ctx.roundRect(item.x + 16, item.y + 16, 50, 50, 12);
        ctx.fill();
        ctx.drawImage(img, item.x + 25, item.y + 25, 32, 32);
        texture.needsUpdate = true;
      };
      img.src = item.iconUrl;
    });

    return texture;
  }, []);

  useEffect(() => {
    systemTexture.colorSpace = THREE.SRGBColorSpace;
    systemTexture.anisotropy = 8;
  }, [systemTexture]);

  useEffect(() => {
    const tryPlay = (video: HTMLVideoElement | null) => {
      if (!video) return;
      void video.play().catch(() => undefined);
    };
    if (visible) {
      tryPlay(mainVideo.video);
      tryPlay(secondVideo.video);
      const resume = () => {
        tryPlay(mainVideo.video);
        tryPlay(secondVideo.video);
      };
      window.addEventListener("pointerdown", resume, { once: true });
      window.addEventListener("touchstart", resume, { once: true });
      return () => {
        window.removeEventListener("pointerdown", resume);
        window.removeEventListener("touchstart", resume);
      };
    }
    mainVideo.video?.pause();
    secondVideo.video?.pause();
    return undefined;
  }, [mainVideo.video, secondVideo.video, visible]);

  useEffect(() => {
    return () => {
      mainVideo.texture?.dispose();
      secondVideo.texture?.dispose();
      socialTexture?.dispose();
      systemTexture?.dispose();
    };
  }, [mainVideo.texture, secondVideo.texture, socialTexture, systemTexture]);

  useFrame((_, delta) => {
    if (!clusterRef.current) return;
    const target = visible ? 1 : 0;
    const scale = THREE.MathUtils.damp(clusterRef.current.scale.x, target, 9, delta);
    clusterRef.current.scale.setScalar(scale);
  });

  const enableAudioFor = (video: HTMLVideoElement | null) => {
    if (!video) return;
    video.muted = false;
    video.defaultMuted = false;
    video.removeAttribute("muted");
    video.volume = 1;
    void video.play().catch(() => undefined);
  };

  return (
    <group ref={clusterRef}>
      <mesh
        ref={screenRefs.main}
        position={[0, 0.18, 1.35]}
        renderOrder={6}
        onPointerDown={(event) => {
          event.stopPropagation();
          enableAudioFor(mainVideo.video);
        }}
      >
        <planeGeometry args={[1.45, 0.86]} />
        <meshBasicMaterial map={mainVideo.texture ?? undefined} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh
        ref={screenRefs.second}
        position={[0, 0.18, -1.35]}
        rotation={[0, Math.PI, 0]}
        renderOrder={6}
        onPointerDown={(event) => {
          event.stopPropagation();
          enableAudioFor(secondVideo.video);
        }}
      >
        <planeGeometry args={[1.45, 0.86]} />
        <meshBasicMaterial map={secondVideo.texture ?? undefined} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={screenRefs.social} position={[-1.35, 0.18, 0]} rotation={[0, -Math.PI / 2, 0]} renderOrder={6}>
        <planeGeometry args={[1.45, 0.86]} />
        <meshBasicMaterial map={socialTexture ?? undefined} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh
        ref={screenRefs.system}
        position={[1.35, 0.18, 0]}
        rotation={[0, Math.PI / 2, 0]}
        renderOrder={6}
      >
        <planeGeometry args={[1.5, 0.9]} />
        <meshBasicMaterial map={systemTexture ?? undefined} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function OrbitingMoon({
  moonRef,
}: {
  moonRef: React.RefObject<THREE.Mesh>;
}) {
  const pivotRef = useRef<THREE.Group>(null);
  const moonTexture = useLoader(THREE.TextureLoader, MOON_TEXTURE_URL);

  useEffect(() => {
    moonTexture.colorSpace = THREE.SRGBColorSpace;
    moonTexture.anisotropy = 8;
  }, [moonTexture]);

  useFrame((_, delta) => {
    if (pivotRef.current) {
      pivotRef.current.rotation.y += delta * MOON_ORBIT_SPEED;
    }
  });

  return (
    <group ref={pivotRef} rotation={[0.18, 0, 0]}>
      <mesh ref={moonRef} position={[MOON_ORBIT_RADIUS, -1.24, 0]}>
        <sphereGeometry args={[MOON_RADIUS, 64, 64]} />
        <meshStandardMaterial map={moonTexture} roughness={1} metalness={0} transparent opacity={1} />
      </mesh>
    </group>
  );
}

function MoonOcclusionController({
  moonRef,
  screenRefs,
  enabled,
}: {
  moonRef: React.RefObject<THREE.Mesh>;
  screenRefs: ScreenRefs;
  enabled: boolean;
}) {
  const moonWorldPos = useMemo(() => new THREE.Vector3(), []);
  const screenWorldPos = useMemo(() => new THREE.Vector3(), []);
  const moonNdc = useMemo(() => new THREE.Vector3(), []);
  const screenNdc = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }) => {
    const moonMesh = moonRef.current;
    if (!moonMesh) return;

    const moonMaterial = moonMesh.material as THREE.MeshStandardMaterial;
    if (!enabled) {
      moonMaterial.transparent = true;
      moonMaterial.opacity = THREE.MathUtils.lerp(moonMaterial.opacity, 1, 0.16);
      return;
    }

    moonMesh.getWorldPosition(moonWorldPos);
    moonNdc.copy(moonWorldPos).project(camera);
    const moonDistance = camera.position.distanceTo(moonWorldPos);
    const projectedMoonRadius = THREE.MathUtils.clamp((MOON_RADIUS / moonDistance) * 1.55, 0.05, 0.34);

    const screens = [screenRefs.main.current, screenRefs.second.current, screenRefs.social.current, screenRefs.system.current].filter(
      Boolean,
    ) as THREE.Mesh[];

    const shouldFade = screens.some((screenMesh) => {
      screenMesh.getWorldPosition(screenWorldPos);
      screenNdc.copy(screenWorldPos).project(camera);
      const screenDistance = camera.position.distanceTo(screenWorldPos);
      const projectedDistance = Math.hypot(moonNdc.x - screenNdc.x, moonNdc.y - screenNdc.y);
      const overlapsScreen = projectedDistance < projectedMoonRadius + 0.14;
      const moonInFront = moonDistance < screenDistance;
      return overlapsScreen && moonInFront;
    });

    const targetOpacity = shouldFade ? 0.2 : 1;
    moonMaterial.transparent = true;
    moonMaterial.opacity = THREE.MathUtils.lerp(moonMaterial.opacity, targetOpacity, 0.2);
  });

  return null;
}

function SpaceBackground({ roomTextureUrl }: { roomTextureUrl: string }) {
  const texture = useLoader(THREE.TextureLoader, roomTextureUrl);
  const { scene } = useThree();

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    return () => {
      if (scene.background === texture) scene.background = null;
    };
  }, [scene, texture]);

  return null;
}

/**
 * Invierte canal de brillo Phong (oceano claro = mas brillante) a roughness PBR (oscuro = menos rugoso).
 */
function specularToRoughnessTexture(specular: THREE.Texture): THREE.CanvasTexture {
  const img = specular.image as HTMLImageElement;
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < data.data.length; i += 4) {
    const g = data.data[i] / 255;
    const rough = 0.22 + (1 - g) * 0.78;
    const v = Math.round(rough * 255);
    data.data[i] = data.data[i + 1] = data.data[i + 2] = v;
  }
  ctx.putImageData(data, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

/** Planeta Tierra central: texturas/material; posicion, radio y orbita intactos. */
function CentralEarth({ onToggleScreens }: { onToggleScreens: () => void }) {
  const earthRef = useRef<THREE.Group>(null);
  const [dayMap, normalMap, specularMap, cloudsMap] = useLoader(THREE.TextureLoader, [
    EARTH_DAY_4K,
    EARTH_NORMAL,
    EARTH_SPECULAR,
    EARTH_CLOUDS,
  ]);

  const roughnessMap = useMemo(
    () => specularToRoughnessTexture(specularMap),
    [specularMap],
  );

  useEffect(() => {
    return () => roughnessMap.dispose();
  }, [roughnessMap]);

  useEffect(() => {
    dayMap.colorSpace = THREE.SRGBColorSpace;
    dayMap.anisotropy = 16;
    dayMap.minFilter = THREE.LinearMipmapLinearFilter;
    dayMap.magFilter = THREE.LinearFilter;
    normalMap.colorSpace = THREE.NoColorSpace;
    normalMap.anisotropy = 16;
    specularMap.colorSpace = THREE.NoColorSpace;
    cloudsMap.colorSpace = THREE.SRGBColorSpace;
    cloudsMap.anisotropy = 12;
  }, [dayMap, normalMap, specularMap, cloudsMap]);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * EARTH_ROTATION_SPEED;
    }
  });

  return (
    <group ref={earthRef}>
      <mesh
        renderOrder={0}
        onPointerDown={(event) => {
          event.stopPropagation();
          onToggleScreens();
        }}
      >
        <sphereGeometry args={[CENTRAL_SPHERE_RADIUS, CENTRAL_SPHERE_SEGMENTS, CENTRAL_SPHERE_SEGMENTS]} />
        <meshPhysicalMaterial
          map={dayMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.045, 0.045)}
          roughnessMap={roughnessMap}
          roughness={1}
          metalness={0.06}
          clearcoat={0.16}
          clearcoatRoughness={0.34}
          envMapIntensity={0}
          toneMapped
          sheen={0.18}
          sheenColor="#2d6aa8"
          sheenRoughness={0.42}
        />
      </mesh>
      {/* Nubes sobre la superficie (misma esfera base, escala minima). */}
      <mesh renderOrder={1} scale={1.0018}>
        <sphereGeometry args={[CENTRAL_SPHERE_RADIUS, 96, 96]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.92}
          depthWrite={false}
          roughness={1}
          metalness={0}
          envMapIntensity={0}
          toneMapped
        />
      </mesh>
      {/* Halo atmosferico suave (capa exterior). */}
      <mesh renderOrder={2} scale={1.024}>
        <sphereGeometry args={[CENTRAL_SPHERE_RADIUS, 72, 56]} />
        <meshBasicMaterial
          color="#6ab4ff"
          transparent
          opacity={0.085}
          depthWrite={false}
          side={THREE.FrontSide}
          blending={THREE.NormalBlending}
        />
      </mesh>
    </group>
  );
}

function DeviceGyroController({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return <DeviceOrientationControls />;
}

/**
 * Modo gafas: dos mitades idénticas (L/R) con la misma cámara, así giroscopio y
 * controles afectan una sola cámara y las dos vistas se mueven a la par.
 * La línea negra central se dibuja en el DOM.
 */
function GlassesSplitRenderer({ active }: { active: boolean }) {
  const { gl, camera, invalidate } = useThree();

  useEffect(() => {
    invalidate();
  }, [active, invalidate]);

  useLayoutEffect(() => {
    const renderer = gl;
    const orig = renderer.render.bind(renderer);

    if (!active) {
      renderer.render = orig;
      return () => {
        renderer.render = orig;
      };
    }

    const cam = camera as THREE.PerspectiveCamera;
    if (!("aspect" in cam) || !cam.isPerspectiveCamera) {
      return;
    }

    renderer.render = (scene, c) => {
      const cAny = c as THREE.PerspectiveCamera;
      if (!cAny.isPerspectiveCamera) {
        return orig(scene, c);
      }
      const w = renderer.domElement.width;
      const h = renderer.domElement.height;
      const leftW = Math.floor(w / 2);
      const rightW = w - leftW;

      cAny.aspect = leftW / h;
      cAny.updateProjectionMatrix();

      renderer.setScissorTest(true);
      renderer.setViewport(0, 0, leftW, h);
      renderer.setScissor(0, 0, leftW, h);
      orig(scene, c);
      renderer.setViewport(leftW, 0, rightW, h);
      renderer.setScissor(leftW, 0, rightW, h);
      orig(scene, c);

      cAny.aspect = w / h;
      cAny.updateProjectionMatrix();
      renderer.setScissorTest(false);
    };

    return () => {
      renderer.render = orig;
      if (cam.isPerspectiveCamera) {
        cam.aspect = renderer.domElement.width / renderer.domElement.height;
        cam.updateProjectionMatrix();
      }
    };
  }, [active, gl, camera]);

  return null;
}

function readStoredEnvironmentId(): MiMundoEnvironmentId | null {
  try {
    const raw = localStorage.getItem(MI_MUNDO_ENV_STORAGE_KEY);
    return normalizeStoredEnvironmentId(raw);
  } catch {
    /* ignore */
  }
  return null;
}

const MiMundoVRSection = () => {
  const location = useLocation();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [glassesMode, setGlassesMode] = useState(false);
  const [screensVisible, setScreensVisible] = useState(false);
  const moonRef = useRef<THREE.Mesh>(null);
  const screenMainRef = useRef<THREE.Mesh>(null);
  const screenSecondRef = useRef<THREE.Mesh>(null);
  const screenSocialRef = useRef<THREE.Mesh>(null);
  const screenSystemRef = useRef<THREE.Mesh>(null);
  const environmentId = useMemo<MiMundoEnvironmentId>(() => {
    if (typeof window === "undefined") return "lobby";
    return readStoredEnvironmentId() ?? "lobby";
  }, []);

  const roomMode = useMemo(() => getRoomMode(environmentId), [environmentId]);

  const isMobile = useMemo(
    () => typeof navigator !== "undefined" && /android|iphone|ipad|ipod/i.test(navigator.userAgent),
    [],
  );

  const enableGyroscope = async () => {
    if (typeof window === "undefined") return;

    const maybeDeviceOrientation = window.DeviceOrientationEvent as
      | (typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> })
      | undefined;

    if (maybeDeviceOrientation?.requestPermission) {
      const permission = await maybeDeviceOrientation.requestPermission();
      if (permission !== "granted") return;
    }

    setGyroEnabled(true);
  };

  useEffect(() => {
    const state = location.state as { openFreeMatchScreen?: boolean } | null;
    if (state?.openFreeMatchScreen) {
      setScreensVisible(true);
    }
  }, [location.state]);

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(
        Boolean(document.fullscreenElement || (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement),
      );
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    onChange();
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const el = sectionRef.current;
    if (!el) return;
    const isFs = Boolean(
      document.fullscreenElement || (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement,
    );
    if (isFs) {
      if (document.exitFullscreen) {
        void document.exitFullscreen();
      } else {
        (document as Document & { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen?.();
      }
    } else {
      if (el.requestFullscreen) {
        void el.requestFullscreen().catch(() => undefined);
      } else {
        (el as HTMLElement & { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen?.();
      }
    }
  };

  return (
    <section
      id="mi-mundo-vr"
      ref={sectionRef}
      className="relative h-[100dvh] w-full overflow-hidden bg-black"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
        <Canvas
          dpr={[1, 2]}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 0.96,
          }}
          camera={{ position: [0, 0, 5.8], fov: 62, near: 0.1, far: 2000 }}
        >
          <color attach="background" args={roomMode === "equirect_interior" ? ["#0c0812"] : ["#02030a"]} />
          {roomMode === "equirect_interior" ? (
            <>
              <hemisphereLight args={["#fce8f4", "#181018"]} intensity={0.52} />
              <ambientLight intensity={0.34} color="#fff8fc" />
              <directionalLight position={[5, 7, 4]} intensity={1.58} color="#fff5f8" />
              <directionalLight position={[-5, -7, -4]} intensity={1.1} color="#fff5f8" />
            </>
          ) : (
            <>
              <ambientLight intensity={0.36} />
              <directionalLight position={[6, 2.5, 2]} intensity={2.02} color="#eef3fb" />
              <directionalLight position={[-6, -2.5, -2]} intensity={1.18} color="#eef3fb" />
            </>
          )}

          {/* Fondo 360 fijo: estadio de futbol profesional (sustituye los modos previos). */}
          <Suspense fallback={null}>
            <SpaceBackground roomTextureUrl={STADIUM_PANORAMA_URL} />
          </Suspense>
          <Suspense fallback={null}>
            <CentralEarth onToggleScreens={() => setScreensVisible((prev) => !prev)} />
          </Suspense>
          <Suspense fallback={null}>
            <OrbitingMoon moonRef={moonRef} />
          </Suspense>
          <Suspense fallback={null}>
            <MoonScreenCluster
              visible={screensVisible}
              screenRefs={{
                main: screenMainRef,
                second: screenSecondRef,
                social: screenSocialRef,
                system: screenSystemRef,
              }}
            />
          </Suspense>
          <MoonOcclusionController
            moonRef={moonRef}
            enabled={screensVisible}
            screenRefs={{
              main: screenMainRef,
              second: screenSecondRef,
              social: screenSocialRef,
              system: screenSystemRef,
            }}
          />

          <OrbitControls
            makeDefault
            target={[0, 0, 0]}
            enablePan={false}
            enableDamping
            dampingFactor={0.06}
            rotateSpeed={0.65}
            minDistance={3.2}
            maxDistance={12}
            minPolarAngle={0.02}
            maxPolarAngle={Math.PI - 0.02}
          />
          <DeviceGyroController enabled={gyroEnabled} />
          <GlassesSplitRenderer active={glassesMode} />
        </Canvas>
        {glassesMode && (
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-px -translate-x-1/2 bg-black"
            aria-hidden
          />
        )}
        </div>
      </div>

      {isMobile && (
        <button
          type="button"
          onClick={toggleFullscreen}
          className="absolute bottom-4 left-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2.5 text-sm font-display font-semibold text-white/95 shadow-lg backdrop-blur-md transition hover:bg-black/80 hover:border-white/35"
          aria-pressed={isFullscreen}
          title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <Maximize2 className="h-4 w-4 shrink-0" aria-hidden />
          )}
          {isFullscreen ? "Salir" : "Pantalla completa"}
        </button>
      )}

      {isMobile && (
        <button
          type="button"
          onClick={enableGyroscope}
          className="absolute left-1/2 top-20 z-30 -translate-x-1/2 rounded-full border border-cyan-300/50 bg-black/45 px-5 py-2 text-xs font-display font-semibold uppercase tracking-wider text-cyan-100 backdrop-blur-md transition hover:bg-black/65"
        >
          Activar giroscopio
        </button>
      )}
    </section>
  );
};

export default MiMundoVRSection;
