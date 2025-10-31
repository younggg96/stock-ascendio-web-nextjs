"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SectionCard from "@/components/SectionCard";
import { CardSkeleton } from "@/components/LoadingSkeleton";

export default function KOLTrackerLoading() {
  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300">
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
                <div className="px-4 pb-4 space-y-3 animate-pulse">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-100 dark:bg-white/5 rounded-lg"
                    />
                  ))}
                </div>
              </SectionCard>

              {/* Top KOL Ranking Skeleton */}
              <SectionCard
                title="Top KOL Ranking"
                useSectionHeader
                sectionHeaderSubtitle="Discover top-ranked KOLs across all platforms"
              >
                <div className="px-4 pb-4 space-y-3 animate-pulse">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-100 dark:bg-white/5 rounded-lg"
                    />
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
