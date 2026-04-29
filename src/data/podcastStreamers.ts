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
  {
    id: "luna-wave",
    name: "Luna Wave",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=640&q=80",
    immersiveSalaName: "Sala Aurora",
    panoramaImage:
      "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=4096&q=85",
    status: "live",
    streamType: "platform",
    loungeTitle: "Sala Aurora",
    loungeDescription: "Sesion musical en vivo con visuales inmersivos.",
    ticketGrada: 3.99,
    ticketVip: 11.99,
    featuredGames: ["Live Lounge", "Q&A Fans", "After Party"],
  },
  {
    id: "cuby-beat",
    name: "Cuby Beat",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=640&q=80",
    immersiveSalaName: "Club Neon",
    panoramaImage:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=4096&q=85",
    status: "live",
    streamType: "platform",
    loungeTitle: "Club Neon",
    loungeDescription: "Remix set y comunidad en tiempo real.",
    ticketGrada: 3.99,
    ticketVip: 11.99,
    featuredGames: ["Remix Set", "Meet & Greet", "DJ Battle"],
  },
  {
    id: "pixel-jay",
    name: "Pixel Jay",
    avatar:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=640&q=80",
    immersiveSalaName: "Lobby 8-Bit",
    panoramaImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=4096&q=85",
    status: "live",
    streamType: "platform",
    loungeTitle: "Lobby 8-Bit",
    loungeDescription: "Retro gaming talks y mini torneos live.",
    ticketGrada: 3.49,
    ticketVip: 10.99,
    featuredGames: ["Retro Arena", "Mini Torneo", "Co-op Live"],
  },
  {
    id: "sol-ritmo",
    name: "Sol Ritmo",
    avatar:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=640&q=80",
    immersiveSalaName: "Escenario Solar",
    panoramaImage:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=4096&q=85",
    status: "live",
    streamType: "platform",
    loungeTitle: "Escenario Solar",
    loungeDescription: "Acusticos, entrevistas y after show.",
    ticketGrada: 4.49,
    ticketVip: 12.49,
    featuredGames: ["Acustico Live", "Q&A", "After Show"],
  },
  {
    id: "kraken-flow",
    name: "Kraken Flow",
    avatar:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=640&q=80",
    immersiveSalaName: "Arena Deep Bass",
    panoramaImage:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=4096&q=85",
    status: "live",
    streamType: "platform",
    loungeTitle: "Arena Deep Bass",
    loungeDescription: "Sesion urbana con invitados sorpresa.",
    ticketGrada: 4.99,
    ticketVip: 13.99,
    featuredGames: ["Urban Session", "Fan Zone", "Bass Night"],
  },
  {
    id: "nina-zen",
    name: "Nina Zen",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=640&q=80",
    immersiveSalaName: "Sala Chill",
    panoramaImage:
      "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=4096&q=85",
    status: "live",
    streamType: "platform",
    loungeTitle: "Sala Chill",
    loungeDescription: "Talks creativas y musica lo-fi en directo.",
    ticketGrada: 2.99,
    ticketVip: 9.99,
    featuredGames: ["Lo-fi Live", "Creative Talk", "Chill Chat"],
  },
  {
    id: "drako-live",
    name: "Drako Live",
    avatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=640&q=80",
    immersiveSalaName: "Foro Titan",
    panoramaImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=4096&q=85",
    status: "live",
    streamType: "platform",
    loungeTitle: "Foro Titan",
    loungeDescription: "Debate, humor y clips exclusivos.",
    ticketGrada: 3.99,
    ticketVip: 11.99,
    featuredGames: ["Debate Live", "Clips Hub", "Comunidad"],
  },
  {
    id: "alma-sonora",
    name: "Alma Sonora",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=640&q=80",
    immersiveSalaName: "Estudio Velvet",
    panoramaImage:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=4096&q=85",
    status: "live",
    streamType: "platform",
    loungeTitle: "Estudio Velvet",
    loungeDescription: "Concierto intimo y chat de fans.",
    ticketGrada: 4.29,
    ticketVip: 12.29,
    featuredGames: ["Concierto Live", "Fan Room", "Backstage"],
  },
];

export function resolvePodcastVideoId(s: StreamerProfile): string {
  if (s.streamType === "youtube" && s.youtubeVideoId) return s.youtubeVideoId;
  if (s.fallbackVideoId) return s.fallbackVideoId;
  return s.youtubeVideoId ?? "M7lc1UVf-VE";
}
