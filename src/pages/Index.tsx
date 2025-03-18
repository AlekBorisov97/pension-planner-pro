
import Navigation from '@/components/Navigation';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex flex-col">
      <header className="pt-12 pb-6 px-4">
        <h1 className="text-4xl font-semibold text-center tracking-tight mb-2">Retirement Calculator</h1>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          Plan your financial future with our comprehensive retirement calculator. Estimate and compare your retirement income options.
        </p>
      </header>
      
      <main className="flex-1 px-4 pb-16">
        <Navigation />
      </main>
      
      <footer className="py-6 border-t border-border/40 bg-secondary/30 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>© {new Date().getFullYear()} Retirement Calculator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
