"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SectionCard from "@/components/SectionCard";
import KOLTrackerTable from "@/components/KOLTrackerTable";
import TopKOLRanking from "@/components/TopKOLRanking";
import { KOL, fetchKOLs } from "@/lib/kolApi";
import { CardSkeleton } from "@/components/LoadingSkeleton";
import { Users, TrendingUp } from "lucide-react";

export default function KOLTrackerPage() {
  const [kols, setKols] = useState<KOL[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch KOLs
  const loadKOLs = async () => {
    try {
      setLoading(true);
      const data = await fetchKOLs();
      setKols(data);
    } catch (error) {
      console.error("Error loading KOLs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKOLs();
  }, []);

  // Stats
  const trackedKOLs = kols.filter((kol) => kol.isTracking);
  const totalKOLs = kols.length;
  const platformCounts = kols.reduce((acc, kol) => {
    acc[kol.platform] = (acc[kol.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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

        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-2">
            {/* Tables - Side by Side Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
              {/* Top KOL Ranking */}
              <SectionCard
                title="Top KOL Ranking"
                useSectionHeader
                sectionHeaderIcon={TrendingUp}
                sectionHeaderSubtitle="Discover top-ranked KOLs across all platforms"
              >
                <div className="px-4 pb-4">
                  {loading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <CardSkeleton key={i} lines={1} />
                      ))}
                    </div>
                  ) : (
                    <TopKOLRanking kols={kols} onUpdate={loadKOLs} />
                  )}
                </div>
              </SectionCard>

              {/* My Tracked KOLs */}
              <SectionCard
                title="My Tracked KOLs"
                useSectionHeader
                sectionHeaderIcon={Users}
                sectionHeaderSubtitle="Manage and track your selected KOLs"
              >
                <div className="px-4 pb-4">
                  {loading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <CardSkeleton key={i} lines={1} />
                      ))}
                    </div>
                  ) : (
                    <KOLTrackerTable kols={trackedKOLs} onUpdate={loadKOLs} />
                  )}
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
