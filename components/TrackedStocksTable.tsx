"use client";

import { useMemo } from "react";
import HotStocksList, { StockDisplayItem } from "./HotStocksList";
import { TrackedStock } from "@/lib/trackedStockApi";
import { Building2 } from "lucide-react";
import { useMultipleQuotes } from "@/hooks/useStockData";

interface TrackedStocksTableProps {
  stocks: TrackedStock[];
  onUpdate: () => void;
  loading?: boolean;
  onAddClick?: () => void;
}

export default function TrackedStocksTable({
  stocks,
  loading = false,
  onAddClick,
}: TrackedStocksTableProps) {
  // Get all stock symbols
  const symbols = useMemo(() => stocks.map((stock) => stock.symbol), [stocks]);

  // Fetch real-time quotes for all tracked stocks
  const { data: realtimeQuotes, loading: quotesLoading } = useMultipleQuotes(
    symbols,
    30000
  ); // Refresh every 30 seconds

  // Create a map for quick lookup
  const quotesMap = useMemo(() => {
    const map = new Map();
    realtimeQuotes.forEach((quote) => {
      map.set(quote.symbol, quote);
    });
    return map;
  }, [realtimeQuotes]);

  // Convert TrackedStock to StockDisplayItem format
  const stockDisplayItems: StockDisplayItem[] = useMemo(() => {
    return stocks.map((stock) => {
      const realtimeQuote = quotesMap.get(stock.symbol);
      return {
        ticker: stock.symbol,
        companyName: stock.companyName,
        logoUrl: stock.logo,
        price: realtimeQuote?.price ?? stock.currentPrice,
        changePercent: realtimeQuote?.changePercent ?? stock.changePercent,
      };
    });
  }, [stocks, quotesMap]);

  // Show loading state while initial data is being fetched
  if (loading && stocks.length === 0) {
    return (
      <HotStocksList
        stocks={[]}
        loading={true}
        title="My Watchlist"
        showPlatform={false}
        showMetrics={false}
        maxHeight="40rem"
      />
    );
  }

  // Show empty state when no stocks
  if (stocks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-white/50">
        <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No tracked stocks yet</p>
        <p className="text-xs mt-2">
          Click the add button above to start tracking
        </p>
      </div>
    );
  }

  return (
    <HotStocksList
      stocks={stockDisplayItems}
      loading={quotesLoading}
      title="My Watchlist"
      onAddClick={onAddClick}
      showPlatform={false}
      showMetrics={false}
      maxHeight="40rem"
    />
  );
}
