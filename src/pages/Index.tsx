import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import GDPRPopup from "@/components/GDPRPopup";

const Index = () => {
  const [gdprAccepted, setGdprAccepted] = useState(false);

  const handleGDPRAccepted = (accepted: boolean) => {
    setGdprAccepted(accepted);
  };

  return (
    <div className="min-h-screen dsk-gradient flex flex-col">
      {/* App content is blurred/disabled when GDPR not accepted */}
      <div
        className={`${!gdprAccepted ? "pointer-events-none blur-sm opacity-50" : ""} transition-all duration-300 flex flex-col min-h-screen`}
      >
        <header className="green-header pt-3 pb-2 px-4 rounded-b-lg shadow-md">
          <h1 className="text-2xl font-semibold text-center tracking-tight mb-1">
            Моята пенсия
          </h1>
          <p className="text-center text-white/90 max-w-2xl mx-auto text-xs">
            Този сайт има за цел да Ви помогне да прецените дали във Вашия
            случай две пенсии са повече от една.
          </p>
        </header>

        <main className="flex-1 px-4 pb-16 pt-4">
          <Navigation />
        </main>

        <footer className="mt-auto py-3 border-t border-primary/20 bg-secondary/50 text-center text-xs text-muted-foreground">
          <div className="container">
            <div className="flex flex-col items-center gap-2">
              <Link
                to="/privacy-policy"
                className="text-primary hover:underline font-semibold"
              >
                Политика за поверителност
              </Link>
              <p className="text-primary/80">
                © {new Date().getFullYear()} Моята пенсия. Всички права
                запазени.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Overlay to completely block interaction when GDPR not accepted */}
      {!gdprAccepted && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          style={{ pointerEvents: "auto" }}
        />
      )}

      <GDPRPopup onAccepted={handleGDPRAccepted} />
    </div>
  );
};

export default Index;
