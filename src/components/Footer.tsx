import { Headset } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Headset className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-foreground">ViveVR</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2026 ViveVR. Todos los derechos reservados.
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacidad</a>
          <a href="#" className="hover:text-foreground transition-colors">Términos</a>
          <a href="#" className="hover:text-foreground transition-colors">Contacto</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
