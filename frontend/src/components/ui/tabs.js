import { Tabs as RadixTabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { useState } from 'react';


export function CustomTabs({ tabs = [] }) {
  // ✅ Ensure useState is always executed
  const [activeTab, setActiveTab] = useState(tabs[0]?.value || "");

  return (
    <RadixTabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </RadixTabs>
  );
}
