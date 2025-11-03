"use client";

import { useState, Fragment, useMemo } from "react";
import { useRouter } from "next/navigation";
import CompanyLogo from "./CompanyLogo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  TrackedStock,
  sentimentConfig,
  getSentimentCounts,
  getOverallSentiment,
  formatPrice,
  formatPercentage,
  deleteTrackedStock,
} from "@/lib/trackedStockApi";
import {
  Trash2,
  TrendingUp,
  TrendingDown,
  Building2,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Star,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useMultipleQuotes } from "@/hooks/useStockData";

interface TrackedStocksTableProps {
  stocks: TrackedStock[];
  onUpdate: () => void;
}

export default function TrackedStocksTable({
  stocks,
  onUpdate,
}: TrackedStocksTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedStock, setExpandedStock] = useState<string | null>(null);

  // Get all stock symbols
  const symbols = useMemo(() => stocks.map((stock) => stock.symbol), [stocks]);

  // Fetch real-time quotes for all tracked stocks
  const {
    data: realtimeQuotes,
    loading: quotesLoading,
    error: quotesError,
  } = useMultipleQuotes(symbols, 30000); // Refresh every 30 seconds

  // Create a map for quick lookup
  const quotesMap = useMemo(() => {
    const map = new Map();
    realtimeQuotes.forEach((quote) => {
      map.set(quote.symbol, quote);
    });
    return map;
  }, [realtimeQuotes]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this stock?")) return;

    try {
      setDeletingId(id);
      await deleteTrackedStock(id);
      toast.success("Stock deleted successfully");
      onUpdate();
    } catch (error) {
      console.error("Error deleting stock:", error);
      toast.error("Failed to delete stock");
    } finally {
      setDeletingId(null);
    }
  };

  // Navigate to stock detail page
  const handleStockClick = (symbol: string, e: React.MouseEvent) => {
    // Don't navigate if clicking on delete button
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    router.push(`/dashboard/stock/${symbol}`);
  };

  // Toggle expanded row
  const toggleExpanded = (stockId: string) => {
    setExpandedStock(expandedStock === stockId ? null : stockId);
  };

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
    <div className="rounded-md border border-gray-200 dark:border-white/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Stock</TableHead>
            <TableHead className="text-right">
              Price
              {quotesLoading && realtimeQuotes.length > 0 && (
                <span className="ml-2 text-[10px] text-gray-400">
                  Updating...
                </span>
              )}
            </TableHead>
            <TableHead className="text-right">Change</TableHead>
            <TableHead className="text-right">Sentiment</TableHead>
            <TableHead className="text-center">KOLs</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => {
            const sentimentCounts = getSentimentCounts(stock.opinions);
            const overallSentiment = getOverallSentiment(stock.opinions);
            const sentimentStyle = sentimentConfig[overallSentiment];

            // Get real-time quote for this stock
            const realtimeQuote = quotesMap.get(stock.symbol);

            return (
              <Fragment key={stock.id}>
                {/* Main Row */}
                <TableRow
                  className={`${
                    !stock.isTracking ? "opacity-50" : ""
                  } cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors`}
                  onClick={(e) => handleStockClick(stock.symbol, e)}
                >
                  {/* Stock */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {stock.logo ? (
                        <CompanyLogo
                          logoUrl={stock.logo}
                          symbol={stock.symbol}
                          name={stock.symbol}
                          size="sm"
                          shape="rounded"
                          border="light"
                          unoptimized
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700">
                          <Building2 className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-sm text-gray-900 dark:text-white">
                          {stock.symbol}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-white/50 truncate max-w-[150px]">
                          {stock.companyName}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Price - Use real-time data if available */}
                  <TableCell className="text-right">
                    {realtimeQuote ? (
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${realtimeQuote.price.toFixed(2)}
                      </span>
                    ) : quotesLoading ? (
                      <div className="w-16 h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse ml-auto"></div>
                    ) : stock.currentPrice !== undefined ? (
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatPrice(stock.currentPrice)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </TableCell>

                  {/* Change - Use real-time data if available */}
                  <TableCell className="text-right">
                    {realtimeQuote ? (
                      <div
                        className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                          realtimeQuote.change >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {realtimeQuote.change >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {realtimeQuote.change >= 0 ? "+" : ""}
                        {realtimeQuote.changePercent.toFixed(2)}%
                      </div>
                    ) : quotesLoading ? (
                      <div className="w-12 h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse ml-auto"></div>
                    ) : stock.changePercent !== undefined ? (
                      <div
                        className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                          stock.changePercent >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {stock.changePercent >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {formatPercentage(stock.changePercent)}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </TableCell>

                  {/* Sentiment */}
                  <TableCell className="text-right">
                    {stock.opinions.length > 0 ? (
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${sentimentStyle.bgColor} ${sentimentStyle.color} ${sentimentStyle.borderColor} border`}
                      >
                        <span>{sentimentStyle.label}</span>
                        <div
                          className={`w-1 h-1 ${sentimentStyle.dotColor} rounded-full`}
                        ></div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </TableCell>

                  {/* KOLs */}
                  <TableCell className="text-center">
                    {stock.opinions.length > 0 ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-white/70">
                          {stock.opinions.length}
                        </span>
                        <div className="flex items-center gap-1 text-[10px]">
                          <span className="text-green-500">
                            {sentimentCounts.bullish}
                          </span>
                          <span className="text-gray-300 dark:text-gray-600">
                            /
                          </span>
                          <span className="text-red-500">
                            {sentimentCounts.bearish}
                          </span>
                          <span className="text-gray-300 dark:text-gray-600">
                            /
                          </span>
                          <span className="text-gray-500">
                            {sentimentCounts.neutral}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">0</span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDelete(stock.id, e)}
                      disabled={deletingId === stock.id}
                      className="h-7 w-7 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
