import { motion } from "framer-motion";
import { Calendar, Eye, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatUsd, stableUsdInRange } from "@/lib/pricing";

const FeaturedEvents = () => {
  const events = [
    {
      id: "podcast-hub-card",
      title: "VIVE PODCAST HUB",
      genre: "Podcast Premium",
      date: "Acceso inmediato",
      viewers: "Nuevas salas",
      image:
        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
      live: true,
      isFree: true,
      price: 0,
      anchorId: undefined,
      ctaLabel: "Entrar al Podcast Hub",
      to: "/podcast-hub",
    },
    {
      id: "a1b2c3d4-0003-4000-8000-000000000003",
      title: "STAND-UP / TEATRO Royale",
      genre: "Comedia & Teatro | Red Carpet",
      date: "8 Mayo 2026 | Distrito Premium",
      viewers: "31.4K en sala",
      image:
        "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1600&q=80",
      live: true,
      isFree: true,
      price: 0,
      anchorId: "en-vivo",
      ctaLabel: "Entrar al Teatro Hub",
      to: "/teatro-hub",
    },
    {
      id: "a1b2c3d4-0001-4000-8000-000000000001",
      title: "Eclipse Mainstage Festival",
      genre: "Electrónica | Epic Mainstage",
      date: "15 Mayo 2026 | Neon Valley",
      viewers: "58.2K conectados",
      image:
        "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=1600&q=80",
      live: true,
      isFree: false,
      price: 0,
      anchorId: undefined,
    },
    {
      id: "a1b2c3d4-0002-4000-8000-000000000002",
      title: "Inferno Rock Arena Live",
      genre: "Rock | Stadium Energy",
      date: "22 Mayo 2026 | Full House",
      viewers: "36.9K conectados",
      image:
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=80",
      live: false,
      isFree: false,
      price: 0,
      anchorId: "vr",
      ctaLabel: "Ver evento",
      to: "/event/a1b2c3d4-0002-4000-8000-000000000002",
    },
  ];

  return (
    <section id="eventos" className="py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Eventos <span className="text-primary">destacados</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Descubre conciertos y experiencias inmersivas
          </p>
        </motion.div>

        <div className="grid max-w-6xl mx-auto grid-cols-2 gap-3 sm:gap-6 md:gap-8">
          {events.map((event, i) => {
            const paidUsd = !event.isFree
              ? stableUsdInRange(`featured-event:${event.id}`, 10, 15)
              : 0;
            return (
              <Link key={event.id} to={event.to ?? `/event/${event.id}`}>
                <motion.div
                  id={event.anchorId}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="group glass rounded-xl overflow-hidden cursor-pointer hover:border-primary/30 transition-all duration-500 h-full flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    {event.live && (
                      <span className="absolute top-2 left-2 sm:top-4 sm:left-4 flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-display font-semibold bg-destructive/90 text-destructive-foreground rounded-full">
                        <span className="w-1.5 h-1.5 bg-destructive-foreground rounded-full animate-pulse-glow" />
                        EN VIVO
                      </span>
                    )}
                    <span
                      className={`absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-sm font-display font-semibold rounded-full ${
                        event.isFree
                          ? "bg-green-500/90 text-foreground"
                          : "bg-primary/90 text-primary-foreground"
                      }`}
                    >
                      <Ticket className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                      {event.isFree ? "Gratuito" : formatUsd(paidUsd)}
                    </span>
                  </div>
                  <div className="p-3 sm:p-6 flex-1 flex flex-col">
                    <span className="text-[10px] sm:text-xs font-display text-primary tracking-wider uppercase line-clamp-2">
                      {event.genre}
                    </span>
                    <h3 className="text-sm sm:text-xl font-display font-semibold mt-1.5 sm:mt-2 mb-2 sm:mb-4 text-foreground line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4 text-[11px] sm:text-sm text-muted-foreground mt-auto">
                      <span className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                        <span className="truncate sm:line-clamp-none">{event.date}</span>
                      </span>
                      <span className="hidden sm:flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        {event.viewers}
                      </span>
                    </div>
                    <Button variant="heroOutline" size="sm" className="mt-3 sm:mt-5 w-full text-[11px] sm:text-sm h-8 sm:h-9">
                      {event.ctaLabel ?? "Ver evento"}
                    </Button>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
