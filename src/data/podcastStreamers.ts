export type StreamStatus = "live" | "offline";
export type StreamType = "platform" | "youtube";

export interface StreamerProfile {
  id: string;
  name: string;
  avatar: string;
  /** Panorama equirectangular único por sala (Lobby 360). */
  panoramaImage: string;
  /** Nombre del entorno inmersivo (ej. Sala Cuántica). */
  immersiveSalaName: string;
  status: StreamStatus;
  streamType?: StreamType;
  youtubeVideoId?: string;
  /** Video de muestra en la sala si no hay YouTube en vivo */
  fallbackVideoId?: string;
  loungeTitle: string;
  loungeDescription: string;
  ticketGrada: number;
  ticketVip: number;
  featuredGames: string[];
}

export const podcastStreamers: StreamerProfile[] = [
  {
    id: "nova-byte",
    name: "Nova Byte",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=640&q=80",
    immersiveSalaName: "Sala Cuántica",
    panoramaImage:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=4096&q=85",
    status: "live",
    streamType: "platform",
    fallbackVideoId: "M7lc1UVf-VE",
    loungeTitle: "Quantum Lounge",
    loungeDescription:
      "Debates premium con invitados globales y audio espacial exclusivo.",
    ticketGrada: 4.99,
    ticketVip: 14.99,
    featuredGames: ["Ajedrez Blitz VR", "TCG Arena Podcast", "Drop Zone Battle"],
  },
  {
    id: "axon-king",
    name: "Axon King",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=640&q=80",
    immersiveSalaName: "Escenario Neural",
    panoramaImage:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=4096&q=85",
    status: "live",
    streamType: "youtube",
    youtubeVideoId: "dQw4w9WgXcQ",
    loungeTitle: "Neural Stage",
    loungeDescription:
      "Conversaciones tech, gaming competitivo y comunidad en tiempo real.",
    ticketGrada: 3.99,
    ticketVip: 12.99,
    featuredGames: ["Card Clash", "Chess Royale", "Battle Room Squad"],
  },
  {
    id: "lyra-neon",
    name: "Lyra Neon",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=640&q=80",
    immersiveSalaName: "Aurora Hall",
    panoramaImage:
      "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=4096&q=85",
    status: "offline",
    fallbackVideoId: "ScMzIvxBSi4",
    loungeTitle: "Aurora Hall",
    loungeDescription:
      "Sala social con minijuegos cooperativos y recompensas exclusivas.",
    ticketGrada: 2.99,
    ticketVip: 9.99,
    featuredGames: ["Ajedrez Social", "Pocket Monsters TCG", "Free Fire Squad Hub"],
  },
  {
    id: "zen-orbit",
    name: "Zen Orbit",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=640&q=80",
    immersiveSalaName: "Órbita Zen",
    panoramaImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=4096&q=85",
    status: "offline",
    fallbackVideoId: "aqz-KE-bpKQ",
    loungeTitle: "Orbit Deck",
    loungeDescription:
      "Charlas creativas, comunidad global y eventos surprise en VR lounge.",
    ticketGrada: 5.99,
    ticketVip: 19.99,
    featuredGames: ["Neon Chess", "Collector Cards Club", "Free Arena Party"],
  },
];

export function resolvePodcastVideoId(s: StreamerProfile): string {
  if (s.streamType === "youtube" && s.youtubeVideoId) return s.youtubeVideoId;
  if (s.fallbackVideoId) return s.fallbackVideoId;
  return s.youtubeVideoId ?? "M7lc1UVf-VE";
}
