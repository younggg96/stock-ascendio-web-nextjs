"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MarketNews from "@/components/MarketNews";
import EarningsCalendar from "@/components/EarningsCalendar";
import SectionCard from "@/components/SectionCard";
import { TrendingUp, Calendar } from "lucide-react";
import { SwitchTab } from "@/components/ui/switch-tab";

const newsCategories = [
  { 
    value: "market", 
    label: "Market", 
    icon: <TrendingUp className="w-3.5 h-3.5" />
  },
  { 
    value: "earnings", 
    label: "Earnings", 
    icon: <Calendar className="w-3.5 h-3.5" />
  },
];

interface NewsPageClientProps {
  category: string;
}

export default function NewsPageClient({ category }: NewsPageClientProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(category);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // 更新 URL 路径
    router.push(`/dashboard/news/${value}`, { scroll: false });
  };

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col">
        <Header
          title="Market News"
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-2 p-2 overflow-y-auto">
          {/* Main News Content */}
          <div className="xl:col-span-2 space-y-2">
            {/* News Categories with SectionCard */}
            <SectionCard
              showLiveIndicator
              headerBorder
              padding="md"
              scrollable
              maxHeight="calc(100vh - 180px)"
              contentClassName="space-y-0 px-4 pb-4 mt-2"
              headerExtra={
                <SwitchTab
                  options={newsCategories}
                  value={activeTab}
                  onValueChange={handleTabChange}
                  size="md"
                  variant="pills"
                  className="w-auto"
                />
              }
            >
              {/* Market Tab Content */}
              {activeTab === "market" && (
                <MarketNews />
              )}

              {/* Earnings Tab Content */}
              {activeTab === "earnings" && (
                <EarningsCalendar />
              )}
            </SectionCard>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-2 xl:col-span-1">
            {/* Trending Topics */}
            {/* <SectionCard
              title="Trending Topics"
              titleSize="sm"
              padding="md"
            >
              <div className="space-y-2 px-3 pb-3">
                {[
                  { topic: "Federal Reserve", count: "2.3k mentions" },
                  { topic: "AI Stocks", count: "1.8k mentions" },
                  { topic: "Inflation", count: "1.5k mentions" },
                  { topic: "Tech Earnings", count: "1.2k mentions" },
                  { topic: "Bitcoin ETF", count: "987 mentions" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/10 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-white/50 w-4">#{index + 1}</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white hover:text-primary transition-colors cursor-pointer">
                        {item.topic}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 dark:text-white/50">{item.count}</span>
                  </div>
                ))}
              </div>
            </SectionCard> */}
          </div>
        </div>
      </main>
    </div>
  );
}

