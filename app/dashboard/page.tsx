"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MarketIndex from "@/components/MarketIndex";
import StockChartWithControls from "@/components/StockChartWithControls";
import MarketNews from "@/components/MarketNews";
import HotStocksList from "@/components/HotStocksList";
import Watchlist from "@/components/Watchlist";
import PostList from "@/components/PostList";
import {
  MarketIndexSkeleton,
  SkeletonGrid,
} from "@/components/LoadingSkeleton";
import { useMarketIndices } from "@/hooks/useStockData";
import { useState } from "react";

export default function Dashboard() {
  // Fetch real market indices data with auto-refresh every 30 seconds
  const {
    data: marketIndices,
    loading: indicesLoading,
    error: indicesError,
  } = useMarketIndices(30000);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

        <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-2 p-2 overflow-y-auto">
          <div className="xl:col-span-2 space-y-5">
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {indicesLoading && !marketIndices.length ? (
                <SkeletonGrid count={3}>
                  <MarketIndexSkeleton />
                </SkeletonGrid>
              ) : (
                marketIndices.map((index) => (
                  <MarketIndex key={index.name} {...index} />
                ))
              )}
            </div> */}
            {/* <StockChartWithControls symbol="AAPL" /> */}
            {/* <MarketNews /> */}
            <PostList />
          </div>

          <div className="space-y-2 xl:col-span-1">
            <Watchlist />
            <HotStocksList />
          </div>
        </div>
      </main>
    </div>
  );
}
