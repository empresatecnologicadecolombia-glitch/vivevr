import Navbar from "@/components/Navbar";
import MiMundoVRSection from "@/components/MiMundoVRSection";
import Footer from "@/components/Footer";

/** Vista dedicada: Mi Mundo VR (dos esferas Perfil / Público). Solo accesible desde el botón INICIO. */
const InicioPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <MiMundoVRSection />
      </main>
      <Footer />
    </div>
  );
};

export default InicioPage;
