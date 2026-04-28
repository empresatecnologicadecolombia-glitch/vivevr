import Navbar from "@/components/Navbar";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

/** Guía "Cómo funciona" (VR). Solo accesible desde el botón VR del menú. */
const VrPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default VrPage;
