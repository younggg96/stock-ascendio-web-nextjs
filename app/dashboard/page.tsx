"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MarketIndex from "@/components/MarketIndex";
import StockChartWithControls from "@/components/StockChartWithControls";
import MarketNews from "@/components/MarketNews";
import HotStocksList from "@/components/HotStocksList";
import Watchlist from "@/components/Watchlist";
import {
  MarketIndexSkeleton,
  SkeletonGrid,
} from "@/components/LoadingSkeleton";
import { useMarketIndices } from "@/hooks/useStockData";
import { useState, useEffect } from "react";

export default function Dashboard() {
  // Fetch real market indices data with auto-refresh every 30 seconds
  const {
    data: marketIndices,
    loading: indicesLoading,
    error: indicesError,
  } = useMarketIndices(30000);

  // Initialize with null to avoid hydration mismatch
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Only set time on client side to avoid hydration issues
  useEffect(() => {
    // Set initial time
    setCurrentTime(new Date());

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1">
        <Header
          currentTime={currentTime}
          isLoading={indicesLoading}
          hasError={!!indicesError}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 border-t border-border-light dark:border-border-dark p-4 lg:p-5 overflow-y-auto h-[calc(100vh-72px)] lg:h-[calc(100vh-96px)]">
          <div className="xl:col-span-2 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {indicesLoading && !marketIndices.length ? (
                <SkeletonGrid count={3}>
                  <MarketIndexSkeleton />
                </SkeletonGrid>
              ) : (
                marketIndices.map((index) => (
                  <MarketIndex key={index.name} {...index} />
                ))
              )}
            </div>
            {/* <StockChartWithControls symbol="AAPL" /> */}
            <MarketNews />
          </div>

          <div className="space-y-5 xl:col-span-1">
            <Watchlist />
            <HotStocksList />
          </div>
        </div>
      </main>
    </div>
  );
}
