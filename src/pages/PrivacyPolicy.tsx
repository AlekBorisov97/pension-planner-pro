
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen dsk-gradient flex flex-col">
      <header className="green-header pt-3 pb-2 px-4 rounded-b-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center tracking-tight mb-1">
          Политика за поверителност
        </h1>
      </header>

      <main className="flex-1 px-4 pb-16 pt-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-medium">Политика за поверителност</h2>
          </div>

          <div className="space-y-4 text-muted-foreground">
            <p>Ние уважаваме правото Ви на лична неприкосновеност.</p>
            
            <p>
              Този сайт не съхранява, не изпраща и не обработва лични данни на сървър. 
              Въведената от Вас информация (напр. рождена дата, дата на пенсиониране, 
              размер на пенсията) се използва само на Вашето устройство, с цел извършване 
              на изчисления директно в браузъра.
            </p>
            
            <p className="font-medium">Ние:</p>
            <ul className="space-y-2 pl-5 list-disc">
              <li>Не съхраняваме никакви лични данни;</li>
              <li>Не изпращаме информация към външни сървъри;</li>
              <li>
                Не използваме външни инструменти за анализ или проследяване (напр. Google Analytics), 
                освен ако не е изрично посочено;
              </li>
              <li>Не използваме бисквитки (cookies) за съхранение на въведена от Вас информация.</li>
            </ul>
            
            <p>
              Ако в бъдеще се променят условията по обработката на данни, ще актуализираме 
              тази политика и ще Ви уведомим при следващо посещение.
            </p>
            
            <p>
              За въпроси, свързани с поверителността, можете да се свържете с нас на: [имейл].
            </p>
          </div>
        </div>
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

export default PrivacyPolicy;
