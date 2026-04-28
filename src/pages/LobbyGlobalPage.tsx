import { useCallback, useEffect, useMemo, useState } from "react";
import GlobalLobbyImmersiveScene from "@/components/immersive/GlobalLobbyImmersiveScene";
import { GLOBAL_LOBBY_CLIP_MS, GLOBAL_LOBBY_VIDEO_IDS } from "@/data/globalLobbyFeed";

const LobbyGlobalPage = () => {
  const ids = useMemo(() => GLOBAL_LOBBY_VIDEO_IDS, []);
  const [index, setIndex] = useState(0);
  const [feedPlaying, setFeedPlaying] = useState(true);

  const embedUrl = useMemo(
    () => `https://www.youtube.com/embed/${ids[index]}?rel=0&autoplay=1&mute=1`,
    [ids, index],
  );

  useEffect(() => {
    if (!feedPlaying || ids.length <= 1) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % ids.length);
    }, GLOBAL_LOBBY_CLIP_MS);
    return () => window.clearInterval(t);
  }, [feedPlaying, ids.length]);

  const onToggleFeed = useCallback(() => setFeedPlaying((p) => !p), []);
  const onPrev = useCallback(() => {
    setIndex((i) => (i - 1 + ids.length) % ids.length);
  }, [ids.length]);
  const onNext = useCallback(() => {
    setIndex((i) => (i + 1) % ids.length);
  }, [ids.length]);

  return (
    <GlobalLobbyImmersiveScene
      embedUrl={embedUrl}
      feedPlaying={feedPlaying}
      currentIndex={index}
      totalVideos={ids.length}
      onToggleFeed={onToggleFeed}
      onPrev={onPrev}
      onNext={onNext}
    />
  );
};

export default LobbyGlobalPage;
