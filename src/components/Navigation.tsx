
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import RetirementCalculator from './RetirementCalculator';
import InfoTab from './InfoTab';
import ContactsTab from './ContactsTab';

export default function Navigation() {
  const [activeTab, setActiveTab] = useState("info");
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      setHeaderHeight(header.getBoundingClientRect().height);
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > headerHeight) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("up");
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, headerHeight]);

  const navPosition = scrollDirection === "down" ? "fixed top-0 left-0 right-0 z-10" : 
                    lastScrollY > 0 ? "sticky top-0 z-10" : 
                    "relative";

  const goToCalculator = () => {
    setActiveTab("calculator");
    // Smooth scroll to top when navigating to calculator
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Tabs 
      defaultValue="info"
      value={activeTab}
      className="w-full max-w-4xl mx-auto"
      onValueChange={setActiveTab}
    >
      <div className={`${navPosition} flex justify-center pt-2 pb-2 bg-secondary/80 backdrop-blur-sm border-b border-primary/10 transition-all duration-300`}>
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger 
            value="info"
            className="relative data-[state=active]:text-primary data-[state=active]:font-medium"
          >
            Информация
            {activeTab === "info" && (
              <motion.div
                className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-primary"
                layoutId="activeTab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="calculator"
            className="relative data-[state=active]:text-primary data-[state=active]:font-medium"
          >
            Калкулатор
            {activeTab === "calculator" && (
              <motion.div
                className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-primary"
                layoutId="activeTab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="contacts"
            className="relative data-[state=active]:text-primary data-[state=active]:font-medium"
          >
            Контакти
            {activeTab === "contacts" && (
              <motion.div
                className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-primary"
                layoutId="activeTab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent 
        value="info" 
        className="mt-6 focus-visible:outline-none focus-visible:ring-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <InfoTab onGoToCalculator={goToCalculator} />
        </motion.div>
      </TabsContent>
      
      <TabsContent 
        value="calculator" 
        className="mt-6 focus-visible:outline-none focus-visible:ring-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <RetirementCalculator />
        </motion.div>
      </TabsContent>
      
      <TabsContent 
        value="contacts" 
        className="mt-6 focus-visible:outline-none focus-visible:ring-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <ContactsTab />
        </motion.div>
      </TabsContent>
    </Tabs>
  );
}
