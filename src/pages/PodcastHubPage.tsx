import { motion } from "framer-motion";
import { Box, Mic2, Radio, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { podcastStreamers } from "@/data/podcastStreamers";

const PodcastHubPage = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <Navbar />

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,hsl(var(--primary)/0.2),transparent_40%),radial-gradient(circle_at_80%_90%,hsl(290_80%_60%/0.16),transparent_45%)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <main className="relative z-10 px-6 pt-28 pb-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-12 text-center"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-display font-semibold uppercase tracking-[0.2em] text-primary">
              <Radio className="h-3.5 w-3.5" />
              Sala Podcast Hub
            </span>
            <h1 className="mb-4 font-display text-5xl font-bold tracking-tight md:text-6xl">
              VIVE <span className="text-gradient-neon">PODCAST</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              Cada artista abre un lobby esférico con panorama propio, pantalla flotante y chat sincronizado.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {podcastStreamers.map((streamer, index) => (
              <motion.div
                key={streamer.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 rounded-2xl border border-border/40 bg-card/30 p-6 backdrop-blur-md"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Cada sala combina streaming inmersivo, mini-juegos comunitarios y tienda de objetos virtuales exclusivos del creador.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default PodcastHubPage;
