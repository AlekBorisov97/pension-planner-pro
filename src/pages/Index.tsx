import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen dsk-gradient flex flex-col">
      <header className="green-header pt-3 pb-2 px-4 rounded-b-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center tracking-tight mb-1">
          Моята пенсия
        </h1>
        <p className="text-center text-white/90 max-w-2xl mx-auto text-xs">
          Този сайт има за цел да Ви помогне да прецените дали във Вашия случай
          две пенсии са повече от една.
        </p>
      </header>

      <main className="flex-1 px-4 pb-16 pt-4">
        <Navigation />
      </main>

      <footer className="py-3 border-t border-primary/20 bg-secondary/50 text-center text-xs text-muted-foreground">
        <div className="container">
          <p className="text-primary/80">
            © {new Date().getFullYear()} Моята пенсия. Всички права запазени.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
