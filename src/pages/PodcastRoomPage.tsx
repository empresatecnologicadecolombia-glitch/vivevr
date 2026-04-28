import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PodcastSala360 from "@/components/PodcastSala360";
import { podcastStreamers } from "@/data/podcastStreamers";

const PodcastRoomPage = () => {
  const { id } = useParams<{ id: string }>();
  const streamer = podcastStreamers.find((item) => item.id === id);

  if (!streamer) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex min-h-screen items-center justify-center px-6 pt-20">
          <div className="rounded-2xl border border-border/50 bg-card/40 p-8 text-center backdrop-blur-md">
            <h1 className="mb-3 font-display text-2xl font-bold">Sala no encontrada</h1>
            <Link to="/podcast-hub" className="text-primary underline-offset-4 hover:underline">
              Volver al Podcast Hub
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return <PodcastSala360 streamer={streamer} />;
};

export default PodcastRoomPage;
