"use client";

import { useState, Fragment } from "react";
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

interface TrackedStocksTableProps {
  stocks: TrackedStock[];
  onUpdate: () => void;
}

export default function TrackedStocksTable({
  stocks,
  onUpdate,
}: TrackedStocksTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedStock, setExpandedStock] = useState<string | null>(null);

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
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Change</TableHead>
            <TableHead className="text-right">Sentiment</TableHead>
            <TableHead className="text-center">KOLs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => {
            const sentimentCounts = getSentimentCounts(stock.opinions);
            const overallSentiment = getOverallSentiment(stock.opinions);
            const sentimentStyle = sentimentConfig[overallSentiment];

            return (
              <Fragment key={stock.id}>
                {/* Main Row */}
                <TableRow
                  className={`${
                    !stock.isTracking ? "opacity-50" : ""
                  } cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5`}
                  onClick={() => toggleExpanded(stock.id)}
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

                  {/* Price */}
                  <TableCell className="text-right">
                    {stock.currentPrice !== undefined ? (
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatPrice(stock.currentPrice)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </TableCell>

                  {/* Change */}
                  <TableCell className="text-right">
                    {stock.changePercent !== undefined ? (
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
                </TableRow>
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
