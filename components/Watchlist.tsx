"use client";

import { useMultipleQuotes } from "@/hooks/useStockData";
import {
  WatchlistItemSkeleton,
  SkeletonGrid,
} from "@/components/LoadingSkeleton";

const WATCHLIST_SYMBOLS = ["TSLA", "AMZN", "MSFT", "GOOGL"];

const colorMap: Record<string, string> = {
  TSLA: "bg-blue-500/20 text-blue-400",
  AMZN: "bg-orange-500/20 text-orange-400",
  MSFT: "bg-purple-500/20 text-purple-400",
  GOOGL: "bg-red-500/20 text-red-400",
};

export default function Watchlist() {
  // Fetch real stock data with 30 second refresh
  const {
    data: watchlistItems,
    loading,
    error,
  } = useMultipleQuotes(WATCHLIST_SYMBOLS, 30000);
  return (
    <div className="bg-card-dark p-3.5 rounded-xl border border-border-dark/50">
      <h2 className="text-[15px] font-semibold mb-3">
        My Watchlist
        {loading && (
          <span className="text-[10px] text-white/40 ml-2">Updating...</span>
        )}
      </h2>
      <div className="space-y-2.5">
        {loading && watchlistItems.length === 0 ? (
          <SkeletonGrid count={WATCHLIST_SYMBOLS.length}>
            <WatchlistItemSkeleton />
          </SkeletonGrid>
        ) : (
          watchlistItems.map((item) => {
            const isPositive = item.change >= 0;
            return (
              <div
                key={item.symbol}
                className="flex justify-between items-center py-0.5"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 ${
                      colorMap[item.symbol] || "bg-gray-500/20 text-gray-400"
                    } flex items-center justify-center rounded-full font-semibold text-[10px]`}
                  >
                    {item.symbol.slice(0, 4)}
                  </div>
                  <div>
                    <p className="font-medium text-[12px] text-white">
                      {item.symbol}
                    </p>
                    <p className="text-[10px] text-white/40 mt-0.5">
                      {item.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[12px] text-white">
                    ${item.price.toFixed(2)}
                  </p>
                  <p
                    className={`text-[10px] font-medium ${
                      isPositive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {item.change.toFixed(2)} ({isPositive ? "+" : ""}
                    {item.changePercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
