import Navbar from "@/components/Navbar";
import FeaturedEvents from "@/components/FeaturedEvents";
import Footer from "@/components/Footer";

const EventosPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <FeaturedEvents />
      </main>
      <Footer />
    </div>
  );
};

export default EventosPage;
