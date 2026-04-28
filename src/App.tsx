import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { paypalScriptOptions } from "@/config/payments";
import Index from "./pages/Index.tsx";
import EventPage from "./pages/EventPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import TiendaPage from "./pages/TiendaPage.tsx";
import PodcastHubPage from "./pages/PodcastHubPage.tsx";
import PodcastRoomPage from "./pages/PodcastRoomPage.tsx";
import TeatroHub from "./pages/TeatroHub.tsx";
import SalaTeatro from "./pages/SalaTeatro.tsx";
import MiMundoPerfilPage from "./pages/MiMundoPerfilPage.tsx";
import LobbyGlobalPage from "./pages/LobbyGlobalPage.tsx";
import EventosPage from "./pages/EventosPage.tsx";
import InicioPage from "./pages/InicioPage.tsx";
import NuestrasSalasPage from "./pages/NuestrasSalasPage.tsx";
import VrPage from "./pages/VrPage.tsx";
import EducacionPage from "./pages/EducacionPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PayPalScriptProvider options={paypalScriptOptions}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/inicio" element={<InicioPage />} />
            <Route path="/eventos" element={<EventosPage />} />
            <Route path="/nuestras-salas" element={<NuestrasSalasPage />} />
            <Route path="/educacion" element={<EducacionPage />} />
            <Route path="/vr" element={<VrPage />} />
            <Route path="/event/:id" element={<EventPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/tienda" element={<TiendaPage />} />
            <Route path="/podcast-hub" element={<PodcastHubPage />} />
            <Route path="/podcast/:id" element={<PodcastRoomPage />} />
            <Route path="/teatro-hub" element={<TeatroHub />} />
            <Route path="/teatro/:id" element={<SalaTeatro />} />
            <Route path="/mi-mundo/lobby-global" element={<LobbyGlobalPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </PayPalScriptProvider>
  </QueryClientProvider>
);

export default App;
