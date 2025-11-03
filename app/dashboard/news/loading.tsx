"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SectionCard from "@/components/SectionCard";
import { TrendingUp, Calendar } from "lucide-react";

export default function NewsLoading() {
  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300">
      <Sidebar isOpen={false} onClose={() => {}} />

      <main className="flex-1 flex flex-col">
        <Header title="Market News" onMenuClick={() => {}} />

        <div className="flex-1 p-2 overflow-y-auto">
          <div className="space-y-2">
            {/* News Categories Skeleton */}
            <SectionCard
              showLiveIndicator
              headerBorder
              padding="md"
              scrollable
              maxHeight="calc(100vh - 180px)"
              contentClassName="space-y-0 px-4 pb-4 mt-2"
              headerExtra={
                <div className="flex gap-2">
                  {/* Tab Skeleton */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-200 dark:bg-white/10">
                    <TrendingUp className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    <div className="h-3 bg-gray-300 dark:bg-white/20 rounded w-12 animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    <div className="h-3 bg-gray-300 dark:bg-white/10 rounded w-14 animate-pulse"></div>
                  </div>
                </div>
              }
            >
              {/* Content Skeleton */}
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 p-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-dark"
                  >
                    {/* Title */}
                    <div className="space-y-1.5">
                      <div className="h-4 bg-gray-300 dark:bg-white/10 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-gray-300 dark:bg-white/10 rounded w-4/5 animate-pulse"></div>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-xs">
                      <div className="h-3 bg-gray-300 dark:bg-white/10 rounded w-20 animate-pulse"></div>
                      <div className="h-3 bg-gray-300 dark:bg-white/10 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  );
}
