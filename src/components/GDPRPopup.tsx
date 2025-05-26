
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface GDPRPopupProps {
  onAccepted: (accepted: boolean) => void;
}

const GDPRPopup = ({ onAccepted }: GDPRPopupProps) => {
  const [open, setOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasAccepted = useRef(false);

  useEffect(() => {
    // Check if the user has already seen the GDPR popup
    const hasSeenGDPR = localStorage.getItem("gdpr-accepted");
    if (hasSeenGDPR === "true") {
      hasAccepted.current = true;
      onAccepted(true);
    } else {
      setOpen(true);
      onAccepted(false);
      
      // Start monitoring for inspector manipulation
      intervalRef.current = setInterval(() => {
        // If user hasn't accepted but popup is not visible, they might have manipulated DOM
        if (!hasAccepted.current) {
          const popupElement = document.querySelector('[data-gdpr-popup]');
          if (popupElement) {
            const computedStyle = window.getComputedStyle(popupElement);
            const isHidden = computedStyle.display === 'none' || 
                           computedStyle.visibility === 'hidden' || 
                           computedStyle.opacity === '0' ||
                           popupElement.getAttribute('style')?.includes('display: none') ||
                           popupElement.getAttribute('style')?.includes('visibility: hidden');
            
            if (isHidden) {
              // Reset the popup visibility
              setOpen(true);
              onAccepted(false);
              console.warn('GDPR popup manipulation detected - restoring popup');
            }
          }
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onAccepted]);

  const handleAccept = () => {
    hasAccepted.current = true;
    localStorage.setItem("gdpr-accepted", "true");
    setOpen(false);
    onAccepted(true);
    
    // Clear the monitoring interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Prevent closing the dialog through escape or clicking outside
  const handleOpenChange = (newOpen: boolean) => {
    if (!hasAccepted.current) {
      // Don't allow closing if not accepted
      setOpen(true);
    } else {
      setOpen(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="max-w-md" 
        data-gdpr-popup="true"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
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
          <ul className="mb-4 space-y-2 pl-5 list-disc">
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
