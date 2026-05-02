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
  const ONNIVERSE_OPEN_SILVESTRE_URL =
    "onniverso://open?url=https://res.cloudinary.com/dfsabdxup/video/upload/v1777748643/Silvestre_hxjmdi.mp4";
  const ONNIVERSE_OPEN_FRANCO_URL =
    "onniverso://open?url=https://res.cloudinary.com/dfsabdxup/video/upload/v1777751512/Franco_Escamilla.-_Mon%C3%B3logo__Ol%C3%ADmpicos_de_Invierno__hmo9ss.mp4";
  const ONNIVERSE_OPEN_J_BALVIN_URL =
    "onniverso://open?url=https://res.cloudinary.com/dfsabdxup/video/upload/v1777751506/57_-_JBalvin_-_Ciudad_Primavera_C%C3%BAcuta_11_Abril_2026_tlyhcw.mp4";
  const ONNIVERSE_OPEN_SHAKIRA_URL =
    "onniverso://open?url=https://res.cloudinary.com/dfsabdxup/video/upload/v1777751493/Shakira_-_MTV_Video_Vanguard_Performance_-_Live_on_The_2023_MTV_Video_Music_Awards_h6jzy5.mp4";
  const ONNIVERSE_OPEN_SANTA_FE_KLAN_URL =
    "onniverso://open?url=https://res.cloudinary.com/dfsabdxup/video/upload/v1777751492/Santa_Fe_Klan_-_Velorios_Video_Oficial_ovnftc.mp4";
  const ONNIVERSE_OPEN_ANUEL_AA_URL =
    "onniverso://open?url=https://res.cloudinary.com/dfsabdxup/video/upload/v1777751466/Anuel_en_vivo_que_nos_pas%C3%B3_mujrd0.mp4";
  const ONNIVERSE_OPEN_ALOFOKE_URL =
    "onniverso://open?url=https://res.cloudinary.com/dfsabdxup/video/upload/v1777751455/MICHAEL_FLORES_X_ALOFOKE_MUSIC_X_JEY_ONE_X_YOVANI_VASQUEZ_-_PODCATERA_qotzfz.mp4";
  const ONNIVERSE_OPEN_WESTCOL_URL =
    "onniverso://open?url=https://res.cloudinary.com/dfsabdxup/video/upload/v1777751404/AS%C3%8D_QUED%C3%93_MI_G_WAGON_REFORMADA_LUJOSA_EN_MEDELL%C3%8DN___WESTCOL_gucqxx.mp4";
  const ONNIVERSE_OPEN_SELENA_URL =
    "onniverso://open?url=https://res.cloudinary.com/dfsabdxup/video/upload/v1777757336/Selena_-_Bidi_Bidi_Bom_Bom_hcvcfk.mp4";
  const ONNIVERSE_OPEN_ARCANGEL_URL =
    "onniverso://open?url=https://res.cloudinary.com/dfsabdxup/video/upload/v1777757206/Arcangel_Bad_Bunny_-_La_Jumpa_Video_Oficial___SR._SANTOS_tkd2gl.mp4";
  const ONNIVERSE_OPEN_BAD_BUNNY_URL =
    "onniverso://open?url=https://res.cloudinary.com/dfsabdxup/video/upload/v1777757420/Bad_Bunny_s_Apple_Music_Super_Bowl_Halftime_Show_jfvgow.mp4";
  const ONNIVERSE_OPEN_BEELE_URL =
    "onniverso://open?url=https://res.cloudinary.com/dfsabdxup/video/upload/v1777757253/BE%C3%89LE_-_LA_PLENA_EN_VIVO_hamldd.mp4";
  const ONNIVERSE_OPEN_XAVI_URL =
    "onniverso://open?url=https://res.cloudinary.com/dfsabdxup/video/upload/v1777757372/Xavi_Manuel_Turizo_-_En_Privado_Official_Video_elhacp.mp4";
  const ONNIVERSE_OPEN_HABLANDO_HUEVADAS_URL =
    "onniverso://open?url=https://res.cloudinary.com/dfsabdxup/video/upload/v1777757434/TE_AMO..._PERO_COMO_AMIGO_-_CLIP_RESCATANDO_HUEVADAS_osecn9.mp4";
  const ONNIVERSE_OPEN_MICHAEL_JACKSON_URL =
    "onniverso://open?url=https://res.cloudinary.com/dfsabdxup/video/upload/v1777757437/Michael_Jackson_-_Billie_Jean_-_Live_Munich_1997_-_Widescreen_HD_gei36m.mp4";
  const ONNIVERSE_OPEN_DADDY_YANKEE_URL =
    "onniverso://open?url=https://res.cloudinary.com/dfsabdxup/video/upload/v1777757419/Daddy_Yankee_-_Homenaje_Premios_lo_Nuestro_2019_yvgwjk.mp4";

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
      id: "hablando-huevadas",
      name: "Hablando Huevadas",
      image: "/hablando-huevadas.png",
      subtitle: "Peru",
      description: "Live Show Oficial",
      status: "En Vivo",
      to: "/teatro/hablando-huevadas",
      type: "teatro" as const,
    },
    {
      id: "michael-jackson",
      name: "Michael Jackson",
      image: "/michael-jackson-avatar.png",
      subtitle: "USA",
      description: "Show inmersivo y hits eternos",
      status: "VIP",
      to: "/teatro/michael-jackson",
      type: "teatro" as const,
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
                const onniverseAppHref =
                  room.id === "nova-byte"
                    ? ONNIVERSE_OPEN_KAROL_URL
                    : room.id === "axon-king"
                      ? ONNIVERSE_OPEN_SILVESTRE_URL
                      : room.id === "franco-escamilla"
                        ? ONNIVERSE_OPEN_FRANCO_URL
                        : room.id === "j-balvin"
                          ? ONNIVERSE_OPEN_J_BALVIN_URL
                          : room.id === "shakira"
                            ? ONNIVERSE_OPEN_SHAKIRA_URL
                            : room.id === "santa-fe-klan"
                              ? ONNIVERSE_OPEN_SANTA_FE_KLAN_URL
                              : room.id === "anuel-aa"
                                ? ONNIVERSE_OPEN_ANUEL_AA_URL
                                : room.id === "alofoke"
                                  ? ONNIVERSE_OPEN_ALOFOKE_URL
                                  : room.id === "westcol"
                                    ? ONNIVERSE_OPEN_WESTCOL_URL
                                    : room.id === "selena-quintanilla"
                                      ? ONNIVERSE_OPEN_SELENA_URL
                                      : room.id === "arcangel"
                                        ? ONNIVERSE_OPEN_ARCANGEL_URL
                                        : room.id === "bad-bunny"
                                          ? ONNIVERSE_OPEN_BAD_BUNNY_URL
                                          : room.id === "beele"
                                          ? ONNIVERSE_OPEN_BEELE_URL
                                          : room.id === "xavi"
                                            ? ONNIVERSE_OPEN_XAVI_URL
                                            : room.id === "hablando-huevadas"
                                              ? ONNIVERSE_OPEN_HABLANDO_HUEVADAS_URL
                                              : room.id === "michael-jackson"
                                                ? ONNIVERSE_OPEN_MICHAEL_JACKSON_URL
                                                : room.id === "daddy-yankee"
                                                  ? ONNIVERSE_OPEN_DADDY_YANKEE_URL
                                                  : null;

                return (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: index * 0.06 }}
                  >
                    {onniverseAppHref != null ? (
                      <a
                        href={onniverseAppHref}
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
