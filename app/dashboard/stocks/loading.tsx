"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SectionCard from "@/components/SectionCard";

export default function StockTrackerLoading() {
  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300">
      <Sidebar isOpen={false} onClose={() => {}} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header title="Stock Tracker" onMenuClick={() => {}} />

        <div className="flex-1 p-2 overflow-y-auto">
          <div className="space-y-2">
            {/* My Tracked Stocks Skeleton */}
            <SectionCard title="My Watchlist" useSectionHeader>
              <div className="px-4 pb-4">
                {/* Search Bar Skeleton */}
                <div className="h-8 bg-gray-100 dark:bg-white/5 rounded-md mb-3 animate-pulse"></div>

                {/* Table Skeleton */}
                <div className="rounded-md border border-gray-200 dark:border-white/10">
                  <div className="space-y-0">
                    {/* Header */}
                    <div className="h-10 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10"></div>
                    {/* Rows */}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-14 bg-white dark:bg-gray-800/50 border-b border-gray-200 dark:border-white/10 last:border-b-0 animate-pulse"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  );
}
