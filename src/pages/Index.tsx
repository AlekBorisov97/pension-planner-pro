
import Navigation from '@/components/Navigation';

const Index = () => {
  return (
    <div className="min-h-screen dsk-gradient flex flex-col">
      <header className="green-header pt-4 pb-3 px-4 rounded-b-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center tracking-tight mb-1">Калкулатор за пенсиониране</h1>
        <p className="text-center text-white/90 max-w-2xl mx-auto text-sm">
          Планирайте финансовото си бъдеще с нашия калкулатор. Изчислете и сравнете вариантите за пенсионен доход.
        </p>
      </header>
      
      <main className="flex-1 px-4 pb-16 pt-4">
        <Navigation />
      </main>
      
      <footer className="py-4 border-t border-primary/20 bg-secondary/50 text-center text-sm text-muted-foreground">
        <div className="container">
          <p className="text-primary/80">© {new Date().getFullYear()} Калкулатор за пенсиониране. Всички права запазени.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
