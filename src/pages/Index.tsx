
import Navigation from '@/components/Navigation';

const Index = () => {
  return (
    <div className="min-h-screen dsk-gradient flex flex-col">
      <header className="green-header pt-12 pb-6 px-4 rounded-b-lg shadow-md">
        <h1 className="text-4xl font-semibold text-center tracking-tight mb-2">Retirement Calculator</h1>
        <p className="text-center text-white/90 max-w-2xl mx-auto">
          Plan your financial future with our comprehensive retirement calculator. Estimate and compare your retirement income options.
        </p>
      </header>
      
      <main className="flex-1 px-4 pb-16">
        <Navigation />
      </main>
      
      <footer className="py-6 border-t border-primary/20 bg-secondary/50 text-center text-sm text-muted-foreground">
        <div className="container">
          <p className="text-primary/80">© {new Date().getFullYear()} Retirement Calculator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
