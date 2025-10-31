"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SectionCard from "@/components/SectionCard";
import KOLTrackerTable from "@/components/KOLTrackerTable";
import TopKOLRanking from "@/components/TopKOLRanking";
import { SwitchTab } from "@/components/ui/switch-tab";
import { KOL } from "@/lib/kolApi";
import { Star, TrendingUp } from "lucide-react";

interface KOLPageClientProps {
  initialKOLs: KOL[];
}

export default function KOLPageClient({ initialKOLs }: KOLPageClientProps) {
  const [kols, setKols] = useState<KOL[]>(initialKOLs);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"tracked" | "ranking">("tracked");

  // Reload KOLs
  const loadKOLs = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch("/api/kol");
      if (!response.ok) throw new Error("Failed to fetch KOLs");
      const data = await response.json();
      setKols(data);
    } catch (error) {
      console.error("Error loading KOLs:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Stats
  const trackedKOLs = kols.filter((kol) => kol.isTracking);

  // Tab options - use useMemo to avoid recreating on every render
  const tabOptions = useMemo(
    () => [
      {
        value: "tracked",
        label: "My Tracked",
        icon: <Star className="w-3.5 h-3.5" />,
      },
      {
        value: "ranking",
        label: "Top Ranking",
        icon: <TrendingUp className="w-3.5 h-3.5" />,
      },
    ],
    []
  );

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title="KOL Tracker"
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <div className="flex-1 p-2 overflow-y-auto">
          <div className="space-y-2">
            {/* Unified KOL Table with Tab Switcher */}
            <SectionCard
              title="KOL Tracker"
              useSectionHeader
              sectionHeaderSubtitle={
                activeTab === "tracked"
                  ? "Manage and track your selected KOLs"
                  : "Discover top-ranked KOLs across all platforms"
              }
              headerRightExtra={
                <SwitchTab
                  options={tabOptions}
                  value={activeTab}
                  onValueChange={(value) =>
                    setActiveTab(value as "tracked" | "ranking")
                  }
                  size="sm"
                  variant="pills"
                />
              }
            >
              <div className="px-4 pb-4">
                {activeTab === "tracked" ? (
                  <KOLTrackerTable kols={trackedKOLs} onUpdate={loadKOLs} />
                ) : (
                  <TopKOLRanking kols={kols} onUpdate={loadKOLs} />
                )}
              </div>
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  );
}
