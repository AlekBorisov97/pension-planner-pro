
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const GDPRPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the GDPR popup
    const hasSeenGDPR = localStorage.getItem("gdpr-seen");
    if (!hasSeenGDPR) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    // Store in localStorage that the user has seen the GDPR popup
    localStorage.setItem("gdpr-seen", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-5 w-5 text-primary" />
            Политика за поверителност
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto text-sm text-muted-foreground">
          <p className="mb-4">Ние уважаваме правото Ви на лична неприкосновеност.</p>
          
          <p className="mb-4">
            Този сайт не съхранява, не изпраща и не обработва лични данни на сървър. 
            Въведената от Вас информация (напр. рождена дата, дата на пенсиониране, 
            размер на пенсията) се използва само на Вашето устройство, с цел извършване 
            на изчисления директно в браузъра.
          </p>
          
          <p className="mb-2">Ние:</p>
          <ul className="mb-4 space-y-2 pl-5">
            <li>Не съхраняваме никакви лични данни;</li>
            <li>Не изпращаме информация към външни сървъри;</li>
            <li>
              Не използваме външни инструменти за анализ или проследяване (напр. Google Analytics), 
              освен ако не е изрично посочено;
            </li>
            <li>Не използваме бисквитки (cookies) за съхранение на въведена от Вас информация.</li>
          </ul>
          
          <p className="mb-4">
            Ако в бъдеще се променят условията по обработката на данни, ще актуализираме 
            тази политика и ще Ви уведомим при следващо посещение.
          </p>
          
          <p>
            За въпроси, свързани с поверителността, можете да се свържете с нас на: [имейл].
          </p>
        </div>
        <DialogFooter>
          <Button className="w-full" onClick={handleAccept}>
            Разбирам
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GDPRPopup;
