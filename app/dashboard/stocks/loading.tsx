"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SectionCard from "@/components/SectionCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function StockTrackerLoading() {
  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300 overflow-hidden">
      <Sidebar isOpen={false} onClose={() => {}} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header title="Stock Tracker" onMenuClick={() => {}} />

        <div className="flex-1 p-2 overflow-y-auto">
          <div className="space-y-2">
            {/* My Tracked Stocks Skeleton */}
            <SectionCard
              title="My Watchlist"
              useSectionHeader
              headerRightExtra={
                <Button size="sm" className="h-8 gap-1.5 text-xs" disabled>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stock</span>
                </Button>
              }
            >
              <div className="px-4 pb-4">
                {/* Table Skeleton */}
                <div className="rounded-md border border-border-light dark:border-border-dark">
                  {/* Table Header */}
                  <div className="grid grid-cols-[200px_1fr_1fr_1fr_120px] gap-4 px-4 py-3 bg-gray-50 dark:bg-white/5 border-b border-border-light dark:border-border-dark">
                    <div className="h-4 bg-gray-300 dark:bg-white/10 rounded w-12 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 dark:bg-white/10 rounded w-10 animate-pulse ml-auto"></div>
                    <div className="h-4 bg-gray-300 dark:bg-white/10 rounded w-14 animate-pulse ml-auto"></div>
                    <div className="h-4 bg-gray-300 dark:bg-white/10 rounded w-16 animate-pulse ml-auto"></div>
                    <div className="h-4 bg-gray-300 dark:bg-white/10 rounded w-8 animate-pulse mx-auto"></div>
                  </div>

                  {/* Table Rows */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[200px_1fr_1fr_1fr_120px] gap-4 px-4 py-3 border-b border-border-light dark:border-border-dark last:border-b-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      {/* Stock Info */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-300 dark:bg-white/10 rounded-md animate-pulse flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="h-3.5 bg-gray-300 dark:bg-white/10 rounded w-16 mb-1.5 animate-pulse"></div>
                          <div className="h-2.5 bg-gray-300 dark:bg-white/10 rounded w-24 animate-pulse"></div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-end">
                        <div className="h-4 bg-gray-300 dark:bg-white/10 rounded w-16 animate-pulse"></div>
                      </div>

                      {/* Change */}
                      <div className="flex items-center justify-end">
                        <div className="h-4 bg-gray-300 dark:bg-white/10 rounded w-14 animate-pulse"></div>
                      </div>

                      {/* Sentiment */}
                      <div className="flex items-center justify-end">
                        <div className="h-6 bg-gray-300 dark:bg-white/10 rounded-full w-20 animate-pulse"></div>
                      </div>

                      {/* KOLs */}
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="h-3 bg-gray-300 dark:bg-white/10 rounded w-8 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  );
}
