import "aframe";
import "aframe-extras";
import { useCallback } from "react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const FLOOR_TEXTURE_URL = "/suelo.avif";

type StarPosition = { x: number; y: number; z: number };

const Lobby3DPage = () => {
  const navigate = useNavigate();

  const handleToggleMaicolPlayback = useCallback(() => {
    const maicolVideo = document.getElementById("maicolVideo") as HTMLVideoElement | null;
    if (!maicolVideo) return;
    if (maicolVideo.paused) {
      void maicolVideo.play();
      return;
    }
    maicolVideo.pause();
  }, []);

  const handleToggleMaicolAudio = useCallback(() => {
    const maicolVideo = document.getElementById("maicolVideo") as HTMLVideoElement | null;
    if (!maicolVideo) return;
    maicolVideo.muted = !maicolVideo.muted;
    if (maicolVideo.paused) {
      void maicolVideo.play();
    }
  }, []);

  const stars = useMemo<StarPosition[]>(() => {
    const items: StarPosition[] = [];
    const count = 90;
    for (let i = 0; i < count; i += 1) {
      const x = (Math.random() - 0.5) * 160;
      const y = 18 + Math.random() * 34;
      const z = (Math.random() - 0.5) * 160;
      items.push({ x, y, z });
    }
    return items;
  }, []);

  return (
    <div className="fixed inset-0 bg-black">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute right-4 top-4 z-20 rounded-full border border-white/35 bg-black/60 px-3 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-sm transition hover:bg-black/80"
      >
        Salir
      </button>
      <div className="absolute left-4 top-4 z-20 flex gap-2">
        <button
          type="button"
          onClick={handleToggleMaicolPlayback}
          className="rounded-full border border-white/35 bg-black/60 px-3 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-sm transition hover:bg-black/80"
        >
          Play/Pausa Maicol
        </button>
        <button
          type="button"
          onClick={handleToggleMaicolAudio}
          className="rounded-full border border-white/35 bg-black/60 px-3 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-sm transition hover:bg-black/80"
        >
          Audio Maicol
        </button>
      </div>

      <a-scene
        renderer="antialias: false; precision: mediump; colorManagement: true; physicallyCorrectLights: true; toneMapping: ACESFilmic; exposure: 1.2; powerPreference: high-performance"
        vr-mode-ui="enabled: true"
        loading-screen="enabled: false"
        embedded={false}
        style={{ width: "100vw", height: "100vh" }}
      >
        <a-assets timeout="3000">
          <img id="lobbyFloor" src={FLOOR_TEXTURE_URL} alt="textura de piso de madera" />
          <video id="maicolVideo" src="/maicol.mp4" autoPlay loop playsInline preload="auto" crossOrigin="anonymous" />
          <video id="paseoVideo" src="/paseo.mp4" autoPlay loop muted playsInline preload="auto" crossOrigin="anonymous" />
        </a-assets>

        <a-entity id="cameraRig" position="0 10.04 8">
          <a-camera
            wasd-controls="acceleration: 40"
            touch-controls
            look-controls="touchEnabled: true; magicWindowTrackingEnabled: true"
          />
        </a-entity>

        <a-entity oculus-touch-controls="hand: left" laser-controls="hand: left" />
        <a-entity oculus-touch-controls="hand: right" laser-controls="hand: right" />

        <a-box
          position="0 12 -35.28"
          width="70.56"
          height="24"
          depth="2"
          material="shader: flat; color: #F1EAD7"
        />
        <a-box
          position="0 12 35.28"
          width="70.56"
          height="24"
          depth="2"
          material="shader: flat; color: #F1EAD7"
        />
        <a-box
          position="-35.28 12 0"
          width="2"
          height="24"
          depth="70.56"
          material="shader: flat; color: #F1EAD7"
        />
        <a-box
          position="35.28 12 0"
          width="2"
          height="24"
          depth="70.56"
          material="shader: flat; color: #F1EAD7"
        />

        {/* Mouldings and trim to match the premium corridor style */}
        <a-box position="0 0.45 -35.15" width="70.56" height="0.9" depth="0.3" material="color: #f6f2e7; roughness: 0.5" />
        <a-box position="0 0.45 35.15" width="70.56" height="0.9" depth="0.3" material="color: #f6f2e7; roughness: 0.5" />
        <a-box position="-35.15 0.45 0" width="0.3" height="0.9" depth="70.56" material="color: #f6f2e7; roughness: 0.5" />
        <a-box position="35.15 0.45 0" width="0.3" height="0.9" depth="70.56" material="color: #f6f2e7; roughness: 0.5" />
        <a-box position="0 23.6 -35.12" width="70.56" height="0.8" depth="0.36" material="color: #ebe5d5; roughness: 0.55" />
        <a-box position="0 23.6 35.12" width="70.56" height="0.8" depth="0.36" material="color: #ebe5d5; roughness: 0.55" />
        <a-box position="-35.12 23.6 0" width="0.36" height="0.8" depth="70.56" material="color: #ebe5d5; roughness: 0.55" />
        <a-box position="35.12 23.6 0" width="0.36" height="0.8" depth="70.56" material="color: #ebe5d5; roughness: 0.55" />

        {/* Ceiling with linear panel strips */}
        <a-plane rotation="90 0 0" position="0 24 0" width="70.2" height="70.2" material="color: #f5f1e8; roughness: 0.45" />
        <a-box position="0 23.96 -27" width="70.2" height="0.03" depth="0.14" material="color: #dfd6c5; roughness: 0.6" />
        <a-box position="0 23.96 -18" width="70.2" height="0.03" depth="0.14" material="color: #dfd6c5; roughness: 0.6" />
        <a-box position="0 23.96 -9" width="70.2" height="0.03" depth="0.14" material="color: #dfd6c5; roughness: 0.6" />
        <a-box position="0 23.96 0" width="70.2" height="0.03" depth="0.14" material="color: #dfd6c5; roughness: 0.6" />
        <a-box position="0 23.96 9" width="70.2" height="0.03" depth="0.14" material="color: #dfd6c5; roughness: 0.6" />
        <a-box position="0 23.96 18" width="70.2" height="0.03" depth="0.14" material="color: #dfd6c5; roughness: 0.6" />
        <a-box position="0 23.96 27" width="70.2" height="0.03" depth="0.14" material="color: #dfd6c5; roughness: 0.6" />

        <a-plane
          rotation="-90 0 0"
          width="70.56"
          height="70.56"
          material="shader: flat; src: #lobbyFloor; repeat: 2 2; color: #ffffff; transparent: false"
        />

        <a-sky color="#04050D" />

        {/* Hanging lanterns inspired by the reference */}
        <a-cylinder position="0 22.7 22" radius="0.06" height="2.1" material="color: #232323; roughness: 0.4" />
        <a-cylinder position="0 22.7 0" radius="0.06" height="2.1" material="color: #232323; roughness: 0.4" />
        <a-cylinder position="0 22.7 -22" radius="0.06" height="2.1" material="color: #232323; roughness: 0.4" />
        <a-box position="0 21.3 22" width="2.1" height="3.2" depth="2.1" material="color: #1f1f1f; metalness: 0.4; roughness: 0.25" />
        <a-box position="0 21.3 0" width="2.1" height="3.2" depth="2.1" material="color: #1f1f1f; metalness: 0.4; roughness: 0.25" />
        <a-box position="0 21.3 -22" width="2.1" height="3.2" depth="2.1" material="color: #1f1f1f; metalness: 0.4; roughness: 0.25" />
        <a-cylinder position="0 21.3 22" radius="0.52" height="2.2" material="color: #fff1cf; emissive: #ffcb84; emissiveIntensity: 0.65" />
        <a-cylinder position="0 21.3 0" radius="0.52" height="2.2" material="color: #fff1cf; emissive: #ffcb84; emissiveIntensity: 0.65" />
        <a-cylinder position="0 21.3 -22" radius="0.52" height="2.2" material="color: #fff1cf; emissive: #ffcb84; emissiveIntensity: 0.65" />

        {/* Built-in niche wall and floating shelves */}
        <a-box position="-28.5 11.6 0" width="1" height="15" depth="23" material="color: #ebe4d4; roughness: 0.62" />
        <a-box position="-28.3 7.1 0" width="1.8" height="0.8" depth="20.2" material="color: #f8f4ea; roughness: 0.45" />
        <a-box position="-27.85 15.5 0" width="2.7" height="0.9" depth="19" material="color: #6f4a2c; roughness: 0.58" />
        <a-box position="-27.85 11.6 0" width="2.7" height="0.9" depth="19" material="color: #6f4a2c; roughness: 0.58" />
        <a-box position="-27.85 7.7 0" width="2.7" height="0.9" depth="19" material="color: #6f4a2c; roughness: 0.58" />

        {/* Decorative frames and objects */}
        <a-cylinder position="-26.8 18.1 -3.5" rotation="0 90 90" radius="2.1" height="0.3" material="color: #875d35; roughness: 0.52" />
        <a-box position="-26.7 13.2 3.6" width="2.4" height="3.1" depth="0.22" material="color: #1f1f1f; roughness: 0.5" />
        <a-box position="-26.62 13.2 3.6" width="2.05" height="2.7" depth="0.05" material="color: #ece7de; roughness: 0.62" />
        <a-box position="-26.7 9.4 -4.7" width="2" height="1.5" depth="0.2" material="color: #1f1f1f; roughness: 0.5" />
        <a-box position="-26.62 9.4 -4.7" width="1.6" height="1.15" depth="0.05" material="color: #d8d0c3; roughness: 0.65" />
        <a-cone position="-26.8 16.3 5.6" radius-bottom="0.9" radius-top="0.15" height="1.5" material="color: #2e5f38; roughness: 0.78" />
        <a-cylinder position="-26.8 15.55 5.6" radius="0.35" height="0.36" material="color: #252525; roughness: 0.4" />
        <a-cone position="-26.8 12.5 -6.6" radius-bottom="0.75" radius-top="0.13" height="1.2" material="color: #3b7b49; roughness: 0.78" />
        <a-cylinder position="-26.8 11.88 -6.6" radius="0.28" height="0.3" material="color: #252525; roughness: 0.4" />
        <a-sphere position="-26.6 8.4 6.2" radius="0.38" material="color: #c7b299; metalness: 0.22; roughness: 0.48" />
        <a-box position="-26.6 8.45 4.2" width="0.7" height="0.16" depth="0.7" material="color: #8a6f50; roughness: 0.56" />
        <a-box position="-26.6 8.65 4.2" width="0.7" height="0.16" depth="0.7" material="color: #9b7e5f; roughness: 0.56" />

        {/* Corridor rhythm with simple door openings */}
        <a-box position="0 10 20" width="14" height="20" depth="0.6" material="color: #f6f1e4; roughness: 0.55" />
        <a-box position="0 10 -20" width="14" height="20" depth="0.6" material="color: #f6f1e4; roughness: 0.55" />
        <a-video src="#maicolVideo" position="0 10.2 19.62" width="9.84" height="5.52" material="shader: flat" />
        <a-video src="#paseoVideo" position="0 10.2 -19.62" rotation="0 180 0" width="8.2" height="4.6" material="shader: flat" />

        {stars.map((star, index) => (
          <a-sphere
            key={`${star.x}-${star.y}-${star.z}-${index}`}
            position={`${star.x} ${star.y} ${star.z}`}
            radius="0.1"
            material="color: #ffffff; emissive: #8ca9ff; emissiveIntensity: 0.35"
          />
        ))}

        <a-entity light="type: ambient; intensity: 0.48; color: #fff6ea" />
        <a-entity light="type: point; intensity: 1.05; distance: 28; decay: 1.8; color: #ffd39a" position="0 20.8 22" />
        <a-entity light="type: point; intensity: 1.05; distance: 28; decay: 1.8; color: #ffd39a" position="0 20.8 0" />
        <a-entity light="type: point; intensity: 1.05; distance: 28; decay: 1.8; color: #ffd39a" position="0 20.8 -22" />
        <a-entity light="type: directional; intensity: 0.35; color: #fff4df" position="14 22 10" />
        <a-entity light="type: point; intensity: 0.5; distance: 18; color: #ffefcf" position="-28.5 14.2 0" />
      </a-scene>
    </div>
  );
};

export default Lobby3DPage;
