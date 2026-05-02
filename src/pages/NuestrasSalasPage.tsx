import { motion } from "framer-motion";
import { Mic2, Radio, Box } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { podcastStreamers } from "@/data/podcastStreamers";

const SectionHeader = ({
  badge,
  icon: Icon,
  title,
  highlight,
  subtitle,
  accent,
}: {
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  highlight: string;
  subtitle: string;
  accent: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    className="mb-10 text-center"
  >
    <span
      className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-display font-semibold uppercase tracking-[0.2em] ${accent}`}
    >
      <Icon className="h-4 w-4" />
      {badge}
    </span>
    <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
      {title} <span className="text-gradient-neon">{highlight}</span>
    </h2>
    <p className="mx-auto mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">{subtitle}</p>
  </motion.div>
);

const NuestrasSalasPage = () => {
  const ONNIVERSE_OPEN_KAROL_URL =
    "onniverso://open?url=https://res.cloudinary.com/dfsabdxup/video/upload/v1777737430/karol_eund2g.mp4";

  const creatorRooms = [
    ...podcastStreamers.map((streamer) => ({
      id: streamer.id,
      name: streamer.name,
      image: streamer.avatar,
      subtitle: streamer.immersiveSalaName,
      description: streamer.loungeTitle,
      status: streamer.status === "live" ? "En Vivo" : "Offline",
      to: `/podcast/${streamer.id}`,
      type: "podcast" as const,
    })),
    {
      id: "franco-escamilla",
      name: "Franco Escamilla",
      image: "https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=1400&q=80",
      subtitle: "Mexico",
      description: "Monologo Premium",
      status: "En Vivo",
      to: "/teatro/franco-escamilla",
      type: "teatro" as const,
    },
    {
      id: "hablando-huevadas",
      name: "Hablando Huevadas",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80",
      subtitle: "Peru",
      description: "Live Show Oficial",
      status: "En Vivo",
      to: "/teatro/hablando-huevadas",
      type: "teatro" as const,
    },
    {
      id: "comediantes-vip",
      name: "Comediantes VIP",
      image: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1400&q=80",
      subtitle: "Colombia",
      description: "Ricardo Quevedo, Juanda Caribe, Lucho Torres",
      status: "En Vivo",
      to: "/teatro/comediantes-vip",
      type: "teatro" as const,
    },
    {
      id: "vive-leyendas",
      name: "Vive Leyendas",
      image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1400&q=80",
      subtitle: "Canal Curado",
      description: "Rescate de talentos iconicos",
      status: "VIP",
      to: "/teatro/vive-leyendas",
      type: "teatro" as const,
    },
    {
      id: "luna-wave",
      name: "Luna Wave",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1400&q=80",
      subtitle: "Sala Aurora",
      description: "Sesion musical en vivo con visuales inmersivos.",
      status: "En Vivo",
      to: "/podcast/luna-wave",
      type: "podcast" as const,
    },
    {
      id: "cuby-beat",
      name: "Cuby Beat",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=80",
      subtitle: "Club Neon",
      description: "Remix set y comunidad en tiempo real.",
      status: "En Vivo",
      to: "/podcast/cuby-beat",
      type: "podcast" as const,
    },
    {
      id: "pixel-jay",
      name: "Pixel Jay",
      image: "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=1400&q=80",
      subtitle: "Lobby 8-Bit",
      description: "Retro gaming talks y mini torneos live.",
      status: "En Vivo",
      to: "/podcast/pixel-jay",
      type: "podcast" as const,
    },
    {
      id: "sol-ritmo",
      name: "Sol Ritmo",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1400&q=80",
      subtitle: "Escenario Solar",
      description: "Acusticos, entrevistas y after show.",
      status: "En Vivo",
      to: "/podcast/sol-ritmo",
      type: "podcast" as const,
    },
    {
      id: "kraken-flow",
      name: "Kraken Flow",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80",
      subtitle: "Arena Deep Bass",
      description: "Sesion urbana con invitados sorpresa.",
      status: "En Vivo",
      to: "/podcast/kraken-flow",
      type: "podcast" as const,
    },
    {
      id: "nina-zen",
      name: "Nina Zen",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80",
      subtitle: "Sala Chill",
      description: "Talks creativas y musica lo-fi en directo.",
      status: "En Vivo",
      to: "/podcast/nina-zen",
      type: "podcast" as const,
    },
    {
      id: "drako-live",
      name: "Drako Live",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=1400&q=80",
      subtitle: "Foro Titan",
      description: "Debate, humor y clips exclusivos.",
      status: "En Vivo",
      to: "/podcast/drako-live",
      type: "podcast" as const,
    },
    {
      id: "alma-sonora",
      name: "Alma Sonora",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1400&q=80",
      subtitle: "Estudio Velvet",
      description: "Concierto intimo y chat de fans.",
      status: "En Vivo",
      to: "/podcast/alma-sonora",
      type: "podcast" as const,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Navbar />

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_5%,hsl(var(--primary)/0.18),transparent_35%),radial-gradient(circle_at_85%_95%,hsl(290_80%_60%/0.16),transparent_40%)]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <main className="relative z-10 px-6 pt-20 pb-20">
        <div className="container mx-auto max-w-6xl">
          {/* === SALAS === */}
          <section id="podcast" className="scroll-mt-24">
            <SectionHeader
              badge="Salas Maestras"
              icon={Radio}
              title="VIVE"
              highlight="SALAS"
              subtitle="Todas las salas de creadores en una sola cuadrícula. Clic en tarjeta y entras directo."
              accent="border-primary/40 bg-primary/10 text-primary"
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {creatorRooms.map((room, index) => {
                const isNovaByte = room.id === "nova-byte";

                return (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: index * 0.06 }}
                  >
                    {isNovaByte ? (
                      <a
                        href={ONNIVERSE_OPEN_KAROL_URL}
                        className="group block rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_45px_-10px_hsl(var(--primary)/0.5)]"
                      >
                        <div className="relative mb-4 overflow-hidden rounded-xl border border-primary/20">
                          <img
                            src={room.image}
                            alt={room.name}
                            className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-lg border border-white/10 bg-black/45 px-2 py-1 text-[10px] font-display uppercase tracking-wider text-cyan-200 backdrop-blur-md">
                            <span className="flex items-center gap-1">
                              <Box className="h-3 w-3 text-primary" />
                              Sala
                            </span>
                            <span className="text-slate-300">{room.subtitle}</span>
                          </div>
                        </div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <h3 className="font-display text-lg font-semibold text-foreground">
                            {room.name}
                          </h3>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-display font-bold uppercase tracking-wide ${
                              room.status === "En Vivo"
                                ? "bg-destructive/90 text-destructive-foreground"
                                : room.status === "VIP"
                                ? "bg-amber-500/90 text-black"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {room.status}
                          </span>
                        </div>
                        <p className="mb-4 text-sm text-muted-foreground">{room.description}</p>
                        <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 py-2.5 text-xs font-display font-bold uppercase tracking-wide text-primary transition group-hover:bg-primary/20 group-hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.6)]">
                          <Mic2 className="h-4 w-4" />
                          Entrar a sala
                        </span>
                      </a>
                    ) : (
                      <Link
                        to={room.to}
                        className="group block rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_45px_-10px_hsl(var(--primary)/0.5)]"
                      >
                    <div className="relative mb-4 overflow-hidden rounded-xl border border-primary/20">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-lg border border-white/10 bg-black/45 px-2 py-1 text-[10px] font-display uppercase tracking-wider text-cyan-200 backdrop-blur-md">
                        <span className="flex items-center gap-1">
                          <Box className="h-3 w-3 text-primary" />
                          Sala
                        </span>
                        <span className="text-slate-300">{room.subtitle}</span>
                      </div>
                    </div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {room.name}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-display font-bold uppercase tracking-wide ${
                          room.status === "En Vivo"
                            ? "bg-destructive/90 text-destructive-foreground"
                            : room.status === "VIP"
                            ? "bg-amber-500/90 text-black"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {room.status}
                      </span>
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">{room.description}</p>
                    <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 py-2.5 text-xs font-display font-bold uppercase tracking-wide text-primary transition group-hover:bg-primary/20 group-hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.6)]">
                      <Mic2 className="h-4 w-4" />
                      Entrar a sala
                    </span>
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NuestrasSalasPage;
