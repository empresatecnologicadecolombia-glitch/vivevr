import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback } from "react";
import {
  EquirectangularInterior,
  ImmersiveOrbitControls,
  SPHERE_RADIUS,
} from "@/components/immersive/equirectSphereCore";

/** Panorama de la habitación personal (editable en datos más adelante). */
const PERFIL_PANORAMA = "/images/panorama.jpg";

function PerfilSceneContent() {
  return (
    <>
      <Suspense fallback={null}>
        <EquirectangularInterior url={PERFIL_PANORAMA} />
      </Suspense>
      <ambientLight intensity={0.8} />
    </>
  );
}

export default function PerfilImmersiveScene() {
  const onPointerMissed = useCallback(() => {}, []);

  return (
    <div className="h-[100dvh] w-full touch-none bg-black [&_*]:outline-none" style={{ touchAction: "none" }}>
      <Canvas
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 0.12], fov: 72, far: SPHERE_RADIUS * 2 }}
        onPointerMissed={onPointerMissed}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <PerfilSceneContent />
        </Suspense>
        <ImmersiveOrbitControls />
      </Canvas>
    </div>
  );
}
