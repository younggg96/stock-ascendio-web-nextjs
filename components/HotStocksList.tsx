"use client";

import { useMultipleQuotes } from "@/hooks/useStockData";
import { SkeletonGrid } from "@/components/LoadingSkeleton";

// Hot stocks to track - typically high volume/volatility stocks
const HOT_STOCKS = ["NVDA", "GME", "RIVN", "TSLA", "AMD", "AMZN"];

interface HotStockItemProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isHot: boolean;
}

function HotStockItem({
  symbol,
  name,
  price,
  change,
  changePercent,
  isHot,
}: HotStockItemProps) {
  const isPositive = change >= 0;

  return (
    <div className="flex justify-between items-center px-2 py-1 hover:bg-white/5 rounded-md transition-colors duration-200">
      <div className="flex items-center gap-3">
        <div>
          <p className="font-semibold text-sm">{symbol}</p>
          <p className="text-xs text-white/50">{name}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-sm">${price.toFixed(2)}</p>
        <p
          className={`text-xs font-semibold ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? "+" : ""}
          {change.toFixed(2)} ({changePercent.toFixed(2)}%)
        </p>
      </div>
    </div>
  );
}

function HotStockSkeleton() {
  return (
    <div className="flex justify-between items-center px-2 py-1">
      <div className="flex items-center gap-3">
        <div>
          <div className="w-12 h-3 bg-white/10 rounded animate-pulse mb-1" />
          <div className="w-24 h-2 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="text-right">
        <div className="w-16 h-3 bg-white/10 rounded animate-pulse mb-1 ml-auto" />
        <div className="w-20 h-2 bg-white/10 rounded animate-pulse ml-auto" />
      </div>
    </div>
  );
}

export default function HotStocksList() {
  const {
    data: hotStocks,
    loading,
    error,
  } = useMultipleQuotes(HOT_STOCKS, 30000);

  // Determine which stocks are "hot" based on volume/change
  const enrichedStocks = hotStocks.map((stock) => ({
    ...stock,
    isHot: Math.abs(stock.changePercent) > 1.5,
  }));

  // Duplicate the list for seamless infinite scroll
  const duplicatedStocks = [...enrichedStocks, ...enrichedStocks];

  return (
    <div className="bg-card-dark p-4 rounded-lg border border-border-dark">
      <h2 className="text-lg font-bold mb-4">
        Hot Stocks List
        {loading && (
          <span className="text-xs text-white/40 ml-2 font-normal">
            Updating...
          </span>
        )}
      </h2>
      <div className="scroll-container">
        <div className="scroll-content">
          {loading && hotStocks.length === 0 ? (
            <div className="space-y-4">
              <SkeletonGrid count={6}>
                <HotStockSkeleton />
              </SkeletonGrid>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {duplicatedStocks.map((stock, index) => (
                <HotStockItem key={`${stock.symbol}-${index}`} {...stock} />
              ))}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .scroll-container {
          overflow: hidden;
          position: relative;
          height: 18.5rem;
        }
        .scroll-content {
          display: flex;
          flex-direction: column;
          animation: scroll-up 30s linear infinite;
        }
        @keyframes scroll-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        .scroll-container:hover .scroll-content {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
