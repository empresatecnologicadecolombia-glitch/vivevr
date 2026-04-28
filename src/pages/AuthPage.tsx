import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Headset, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      toast.error("Escribe tu correo en el campo de arriba. Recibirás un enlace para restablecer la contraseña.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) throw error;
      toast.success("Revisa tu bandeja de correo. Te enviamos un enlace para crear una nueva contraseña.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al enviar el correo";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("¡Cuenta creada! Revisa tu correo para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("¡Bienvenido de vuelta!");
        navigate(-1);
      }
    } catch (err: any) {
      toast.error(err.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Headset className="w-8 h-8 text-primary" />
            <span className="font-display font-bold text-2xl text-foreground">ViveVR</span>
          </div>
          <p className="text-muted-foreground">
            {isSignUp ? "Crea tu cuenta" : "Inicia sesión en tu cuenta"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="mt-1 bg-muted/50 border-border/40"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-foreground">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="mt-1 bg-muted/50 border-border/40"
            />
            {!isSignUp && (
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline min-h-11 min-w-[12rem] px-1 text-right touch-manipulation"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}
          </div>
          <Button variant="hero" className="w-full min-h-12 touch-manipulation" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSignUp ? "Crear cuenta" : "Iniciar sesión"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isSignUp ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline font-medium"
          >
            {isSignUp ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
