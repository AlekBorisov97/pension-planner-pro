
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import RetirementCalculator from './RetirementCalculator';
import InfoTab from './InfoTab';
import ContactsTab from './ContactsTab';

export default function Navigation() {
  const [activeTab, setActiveTab] = useState("calculator");

  return (
    <Tabs 
      defaultValue="calculator" 
      className="w-full max-w-4xl mx-auto"
      onValueChange={setActiveTab}
    >
      <div className="flex justify-center mb-8">
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger 
            value="calculator"
            className="relative data-[state=active]:text-primary data-[state=active]:font-medium"
          >
            Calculator
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
            value="info"
            className="relative data-[state=active]:text-primary data-[state=active]:font-medium"
          >
            More Info
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
            value="contacts"
            className="relative data-[state=active]:text-primary data-[state=active]:font-medium"
          >
            Contacts
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
        value="calculator" 
        className="mt-0 focus-visible:outline-none focus-visible:ring-0"
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
        value="info" 
        className="mt-0 focus-visible:outline-none focus-visible:ring-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <InfoTab />
        </motion.div>
      </TabsContent>
      
      <TabsContent 
        value="contacts" 
        className="mt-0 focus-visible:outline-none focus-visible:ring-0"
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
