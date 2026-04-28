import { motion } from "framer-motion";
import { Crown, Drama, Mic2, Radio, Sparkles, Theater, Box } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturedEvents from "@/components/FeaturedEvents";
import { podcastStreamers } from "@/data/podcastStreamers";

interface TeatroRoom {
  id: string;
  title: string;
  country: string;
  hosts: string;
  description: string;
  image: string;
  vip: boolean;
}

const teatroRooms: TeatroRoom[] = [
  {
    id: "franco-escamilla",
    title: "Franco Escamilla",
    country: "Mexico",
    hosts: "Monologo Premium",
    description: "Humor filoso, storytelling en vivo y after-talk con la comunidad.",
    image:
      "https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=1400&q=80",
    vip: false,
  },
  {
    id: "hablando-huevadas",
    title: "Hablando Huevadas",
    country: "Peru",
    hosts: "Live Show Oficial",
    description: "Formato irreverente, dinamico y participativo con dinamicas en tiempo real.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80",
    vip: false,
  },
  {
    id: "comediantes-vip",
    title: "Comediantes VIP",
    country: "Colombia",
    hosts: "Ricardo Quevedo, Juanda Caribe, Lucho Torres",
    description: "Noche de stand-up de alto nivel con invitados sorpresa y backstage social.",
    image:
      "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1400&q=80",
    vip: false,
  },
  {
    id: "vive-leyendas",
    title: "Vive Leyendas",
    country: "Canal Curado",
    hosts: "Rescate de talentos iconicos",
    description: "Espacio VIP para revivir personajes de TV y nuevas generaciones de artistas.",
    image:
      "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1400&q=80",
    vip: true,
  },
];

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
          {/* === EVENTOS === */}
          <section id="eventos" className="mb-24 scroll-mt-24">
            <div className="rounded-3xl border border-border/40 bg-card/20 p-2 backdrop-blur-xl md:p-4">
              <FeaturedEvents />
            </div>
          </section>

          {/* === TEATRO === */}
          <section id="teatro" className="mb-24 scroll-mt-24">
            <SectionHeader
              badge="TeatroHub"
              icon={Drama}
              title="STAND-UP /"
              highlight="TEATRO"
              subtitle="Cartelera premium con curaduria internacional, lobbies interactivos y experiencias VIP estratosas."
              accent="border-red-400/40 bg-red-500/10 text-red-200"
            />
            <div className="grid gap-6 md:grid-cols-2">
              {teatroRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Link
                    to={`/teatro/${room.id}`}
                    className="group block overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-red-300/60 hover:shadow-[0_0_45px_-14px_rgba(244,63,94,0.65)]"
                  >
                    <div className="relative mb-4 overflow-hidden rounded-xl border border-red-400/20">
                      <img
                        src={room.image}
                        alt={room.title}
                        className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                      {room.vip && (
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-400/90 px-2.5 py-1 text-[10px] font-display font-bold uppercase text-black">
                          <Crown className="h-3 w-3" />
                          VIP Vive Leyendas
                        </span>
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-xl font-semibold text-foreground">{room.title}</h3>
                        <p className="mt-1 text-xs uppercase tracking-wider text-red-200/90">{room.country}</p>
                      </div>
                      <Theater className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{room.hosts}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{room.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-display uppercase tracking-widest text-primary">
                      <Sparkles className="h-4 w-4" />
                      Entrar a sala
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* === PODCAST === */}
          <section id="podcast" className="scroll-mt-24">
            <SectionHeader
              badge="Sala Podcast Hub"
              icon={Radio}
              title="VIVE"
              highlight="PODCAST"
              subtitle="Cada artista abre un lobby esférico con panorama propio, pantalla flotante y chat sincronizado."
              accent="border-primary/40 bg-primary/10 text-primary"
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {podcastStreamers.map((streamer, index) => (
                <motion.div
                  key={streamer.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Link
                    to={`/podcast/${streamer.id}`}
                    className="group block rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_45px_-10px_hsl(var(--primary)/0.5)]"
                  >
                    <div className="relative mb-4 overflow-hidden rounded-xl border border-primary/20">
                      <img
                        src={streamer.avatar}
                        alt={streamer.name}
                        className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-lg border border-white/10 bg-black/45 px-2 py-1 text-[10px] font-display uppercase tracking-wider text-cyan-200 backdrop-blur-md">
                        <span className="flex items-center gap-1">
                          <Box className="h-3 w-3 text-primary" />
                          Lobby 360
                        </span>
                        <span className="text-slate-300">{streamer.immersiveSalaName}</span>
                      </div>
                    </div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {streamer.name}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-display font-bold uppercase tracking-wide ${
                          streamer.status === "live"
                            ? "bg-destructive/90 text-destructive-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {streamer.status === "live" ? "En Vivo" : "Offline"}
                      </span>
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">{streamer.loungeTitle}</p>
                    <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 py-2.5 text-xs font-display font-bold uppercase tracking-wide text-primary transition group-hover:bg-primary/20 group-hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.6)]">
                      <Mic2 className="h-4 w-4" />
                      Entrar a inmersión 360
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NuestrasSalasPage;
