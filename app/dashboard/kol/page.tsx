"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SectionCard from "@/components/SectionCard";
import KOLTrackerTable from "@/components/KOLTrackerTable";
import { KOL, fetchKOLs } from "@/lib/kolApi";
import { CardSkeleton } from "@/components/LoadingSkeleton";
import { Users } from "lucide-react";

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
  const trackedKOLs = kols.filter((kol) => kol.isTracking).length;
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
            {/* Stats Cards */}
            {!loading && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <div className="bg-white dark:bg-card-dark p-3 rounded-lg border border-border-light dark:border-border-dark">
                  <div className="text-[10px] text-gray-600 dark:text-white/60 mb-0.5">
                    Total KOLs
                  </div>
                  <div className="text-2xl font-bold">{totalKOLs}</div>
                </div>
                <div className="bg-white dark:bg-card-dark p-3 rounded-lg border border-border-light dark:border-border-dark">
                  <div className="text-[10px] text-gray-600 dark:text-white/60 mb-0.5">
                    Tracking
                  </div>
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
                    {trackedKOLs}
                  </div>
                </div>
                <div className="bg-white dark:bg-card-dark p-3 rounded-lg border border-border-light dark:border-border-dark">
                  <div className="text-[10px] text-gray-600 dark:text-white/60 mb-0.5">
                    Platforms
                  </div>
                  <div className="text-2xl font-bold">
                    {Object.keys(platformCounts).length}
                  </div>
                </div>
                <div className="bg-white dark:bg-card-dark p-3 rounded-lg border border-border-light dark:border-border-dark">
                  <div className="text-[10px] text-gray-600 dark:text-white/60 mb-0.5">
                    Top Platform
                  </div>
                  <div className="text-xl font-bold capitalize">
                    {Object.keys(platformCounts).length > 0
                      ? Object.entries(platformCounts).reduce((a, b) =>
                          a[1] > b[1] ? a : b
                        )[0]
                      : "N/A"}
                  </div>
                </div>
              </div>
            )}

            {/* KOL Table */}
            <SectionCard
              title="KOL Management"
              useSectionHeader
              sectionHeaderSubtitle="Manage and track key opinion leaders across different platforms"
            >
              <div className="px-4 pb-4">
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <CardSkeleton key={i} lines={1} />
                    ))}
                  </div>
                ) : (
                  <KOLTrackerTable kols={kols} onUpdate={loadKOLs} />
                )}
              </div>
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  );
}
