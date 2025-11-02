"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SectionCard from "@/components/SectionCard";

export default function KOLTrackerLoading() {
  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300 overflow-hidden">
      <Sidebar isOpen={false} onClose={() => {}} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header title="KOL Tracker" onMenuClick={() => {}} />

        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-2">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
              {/* My Tracked KOLs Skeleton */}
              <SectionCard
                title="My Tracked KOLs"
                useSectionHeader
                sectionHeaderSubtitle="Manage and track your selected KOLs"
              >
                <div className="px-4 pb-4 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-dark"
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-gray-300 dark:bg-white/10 rounded-full animate-pulse flex-shrink-0"></div>
                      {/* Info */}
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 dark:bg-white/10 rounded w-24 animate-pulse"></div>
                        <div className="h-3 bg-gray-300 dark:bg-white/10 rounded w-32 animate-pulse"></div>
                      </div>
                      {/* Actions */}
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-gray-300 dark:bg-white/10 rounded animate-pulse"></div>
                        <div className="w-8 h-8 bg-gray-300 dark:bg-white/10 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Top KOL Ranking Skeleton */}
              <SectionCard
                title="Top KOL Ranking"
                useSectionHeader
                sectionHeaderSubtitle="Discover top-ranked KOLs across all platforms"
              >
                <div className="px-4 pb-4 space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      {/* Rank */}
                      <div className="w-6 h-6 bg-gray-300 dark:bg-white/10 rounded animate-pulse flex-shrink-0"></div>
                      {/* Avatar */}
                      <div className="w-9 h-9 bg-gray-300 dark:bg-white/10 rounded-full animate-pulse flex-shrink-0"></div>
                      {/* Info */}
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3.5 bg-gray-300 dark:bg-white/10 rounded w-28 animate-pulse"></div>
                        <div className="h-2.5 bg-gray-300 dark:bg-white/10 rounded w-20 animate-pulse"></div>
                      </div>
                      {/* Score */}
                      <div className="h-6 bg-gray-300 dark:bg-white/10 rounded-full w-12 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
