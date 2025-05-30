import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface GDPRPopupProps {
  onAccepted: (accepted: boolean) => void;
}

const GDPRPopup = ({ onAccepted }: GDPRPopupProps) => {
  const [open, setOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasAccepted = useRef(false);
  const originalSetItem = useRef(localStorage.setItem);
  const originalRemoveItem = useRef(localStorage.removeItem);
  const originalClear = useRef(localStorage.clear);

  useEffect(() => {
    // Check if the user has already seen the GDPR popup
    const hasSeenGDPR = localStorage.getItem("gdpr-accepted");
    if (hasSeenGDPR === "true") {
      hasAccepted.current = true;
      onAccepted(true);
    } else {
      setOpen(true);
      onAccepted(false);

      // Override localStorage methods to detect manipulation
      localStorage.setItem = function (key: string, value: string) {
        if (key === "gdpr-accepted" && !hasAccepted.current) {
          console.warn(
            "GDPR localStorage manipulation detected - consent must be given properly",
          );
          return;
        }
        return originalSetItem.current.call(this, key, value);
      };

      localStorage.removeItem = function (key: string) {
        if (key === "gdpr-accepted" && hasAccepted.current) {
          console.warn(
            "GDPR localStorage manipulation detected - restoring popup",
          );
          hasAccepted.current = false;
          setOpen(true);
          onAccepted(false);
        }
        return originalRemoveItem.current.call(this, key);
      };

      localStorage.clear = function () {
        if (hasAccepted.current) {
          console.warn(
            "GDPR localStorage manipulation detected - restoring popup",
          );
          hasAccepted.current = false;
          setOpen(true);
          onAccepted(false);
        }
        return originalClear.current.call(this);
      };

      // Start monitoring for inspector manipulation and localStorage changes
      intervalRef.current = setInterval(() => {
        // If user hasn't accepted but popup is not visible, they might have manipulated DOM
        if (!hasAccepted.current) {
          const popupElement = document.querySelector("[data-gdpr-popup]");
          if (popupElement) {
            const computedStyle = window.getComputedStyle(popupElement);
            const isHidden =
              computedStyle.display === "none" ||
              computedStyle.visibility === "hidden" ||
              computedStyle.opacity === "0" ||
              popupElement.getAttribute("style")?.includes("display: none") ||
              popupElement
                .getAttribute("style")
                ?.includes("visibility: hidden");

            if (isHidden) {
              // Reset the popup visibility
              setOpen(true);
              onAccepted(false);
              console.warn(
                "GDPR popup manipulation detected - restoring popup",
              );
            }
          }

          // Check if localStorage was manipulated directly
          const currentGDPRValue = localStorage.getItem("gdpr-accepted");
          if (currentGDPRValue === "true") {
            console.warn(
              "GDPR localStorage manipulation detected - removing unauthorized consent",
            );
            originalRemoveItem.current.call(localStorage, "gdpr-accepted");
            setOpen(true);
            onAccepted(false);
          }
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Restore original localStorage methods
      localStorage.setItem = originalSetItem.current;
      localStorage.removeItem = originalRemoveItem.current;
      localStorage.clear = originalClear.current;
    };
  }, [onAccepted]);

  const handleAccept = () => {
    hasAccepted.current = true;
    originalSetItem.current.call(localStorage, "gdpr-accepted", "true");
    setOpen(false);
    onAccepted(true);

    // Clear the monitoring interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Restore original localStorage methods after acceptance
    localStorage.setItem = originalSetItem.current;
    localStorage.removeItem = originalRemoveItem.current;
    localStorage.clear = originalClear.current;
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
        className="max-w-md [&>button.absolute.top-4.right-4]:hidden"
        data-gdpr-popup="true"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-5 w-5 text-primary" />
            Правила за защита на личните данни
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto text-sm text-muted-foreground space-y-4">
          <p>
            MoyataPensia.bg иска съгласието Ви, за да използва личните Ви данни
            в обем, необходим за предоставянето на услуги от сайта
            https://moyatapensia.bg/
          </p>

          <p>
            С ползването на този сайт, Вие доброволно давате съгласието си за
            обработването на необходимите за предоставянето на услуги, лични
            данни.
          </p>

          <p>
            Въведената от Вас информация не се изпраща и обработва на сървър и
            не се споделя с доставчици. Изчисленията, необходими за предоставяне
            услугите на този сайт се извършват чрез JavaScript изцяло на Вашето
            устройство.
          </p>

          <p>
            Този сайт не използва бисквитки (cookies) за съхранение на
            въведената от Вас информация.
          </p>

          <p>
            За повече подробности, можете да се запознаете с нашите Правила за
            защита на личните данни или да се свържете с нас на:
            <a
              href="mailto:info@moyatapensia.bg"
              className="text-primary underline ml-1"
            >
              moyatapensia@mail.bg
            </a>
          </p>
        </div>
        <DialogFooter>
          <Button className="w-full" onClick={handleAccept}>
            Съгласявам се
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GDPRPopup;
