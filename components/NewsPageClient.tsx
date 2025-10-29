"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import EarningsCalendar from "@/components/EarningsCalendar";
import SectionCard from "@/components/SectionCard";
import FinancialJuiceNews from "@/components/FinancialJuiceNews";
import { TrendingUp, Calendar } from "lucide-react";
import { SwitchTab } from "@/components/ui/switch-tab";
import { useIsMobile } from "@/hooks/useIsMobile";

const newsCategories = [
  {
    value: "market",
    label: "Market",
    icon: <TrendingUp className="w-3.5 h-3.5" />,
  },
  {
    value: "earnings",
    label: "Earnings",
    icon: <Calendar className="w-3.5 h-3.5" />,
  },
];

interface NewsPageClientProps {
  category: string;
}

export default function NewsPageClient({ category }: NewsPageClientProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(category);
  const isMobile = useIsMobile();

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

        <div className="flex-1 p-2 overflow-y-auto">
          {/* Main News Content */}
          <div className="space-y-2">
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
              {/* Market Tab Content - FinancialJuice News */}
              {activeTab === "market" && (
                <div className="h-[calc(100vh-240px)]">
                  <FinancialJuiceNews width="100%" height="100%" />
                </div>
              )}

              {/* Earnings Tab Content */}
              {activeTab === "earnings" && (
                <EarningsCalendar compact={isMobile} />
              )}
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  );
}
