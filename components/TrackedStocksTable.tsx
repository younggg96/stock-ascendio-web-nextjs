"use client";

import { useState } from "react";
import Image from "next/image";
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
            <TableHead className="w-12"></TableHead>
            <TableHead className="w-[200px]">Stock</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Change</TableHead>
            <TableHead className="text-right">Sentiment</TableHead>
            <TableHead className="text-center">Opinions</TableHead>
            <TableHead className="text-right w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => {
            const sentimentCounts = getSentimentCounts(stock.opinions);
            const overallSentiment = getOverallSentiment(stock.opinions);
            const sentimentStyle = sentimentConfig[overallSentiment];
            const isExpanded = expandedStock === stock.id;

            return (
              <>
                {/* Main Row */}
                <TableRow
                  key={stock.id}
                  className={`${
                    !stock.isTracking ? "opacity-50" : ""
                  } cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5`}
                  onClick={() => toggleExpanded(stock.id)}
                >
                  {/* Expand Icon */}
                  <TableCell>
                    {stock.opinions.length > 0 ? (
                      isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )
                    ) : null}
                  </TableCell>

                  {/* Stock */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {stock.logo ? (
                        <div className="w-8 h-8 p-1 rounded overflow-hidden bg-white flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700">
                          <Image
                            src={stock.logo}
                            alt={stock.symbol}
                            width={32}
                            height={32}
                            className="object-contain"
                            unoptimized
                          />
                        </div>
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

                  {/* Opinions Count */}
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

                  {/* Delete Action */}
                  <TableCell className="text-right">
                    <div
                      className="flex justify-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDelete(stock.id, e)}
                        disabled={deletingId === stock.id}
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Expanded Opinions Row */}
                {isExpanded && stock.opinions.length > 0 && (
                  <TableRow className="bg-gray-50 dark:bg-white/5">
                    <TableCell colSpan={7} className="p-0">
                      <div className="p-4 space-y-3">
                        <div className="text-xs font-semibold text-gray-700 dark:text-white/70 mb-2">
                          KOL Opinions for {stock.symbol}
                        </div>
                        <div className="space-y-2">
                          {stock.opinions.map((opinion) => {
                            const opinionSentimentStyle =
                              sentimentConfig[opinion.sentiment];

                            return (
                              <div
                                key={opinion.id}
                                className="p-3 rounded-lg border bg-white dark:bg-gray-800/50 border-gray-200 dark:border-white/10"
                              >
                                {/* Opinion Header */}
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    {opinion.kolAvatarUrl && (
                                      <Image
                                        src={opinion.kolAvatarUrl}
                                        alt={opinion.kolName}
                                        width={28}
                                        height={28}
                                        className="rounded-full"
                                        unoptimized
                                      />
                                    )}
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                                          {opinion.kolName}
                                        </span>
                                        <span className="text-[10px] text-gray-500 dark:text-white/50">
                                          @{opinion.kolUsername}
                                        </span>
                                      </div>
                                      <div className="text-[10px] text-gray-500 dark:text-white/50">
                                        {formatDistanceToNow(
                                          new Date(opinion.publishedAt),
                                          { addSuffix: true }
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Sentiment Badge */}
                                  <div
                                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${opinionSentimentStyle.bgColor} ${opinionSentimentStyle.color} ${opinionSentimentStyle.borderColor} border`}
                                  >
                                    <span>{opinionSentimentStyle.label}</span>
                                    <div
                                      className={`w-1 h-1 ${opinionSentimentStyle.dotColor} rounded-full`}
                                    ></div>
                                  </div>
                                </div>

                                {/* Opinion Content */}
                                <p className="text-xs text-gray-700 dark:text-white/80 mb-2">
                                  {opinion.opinion}
                                </p>

                                {/* Meta Info */}
                                <div className="flex items-center gap-3 text-[10px] text-gray-500 dark:text-white/50 flex-wrap">
                                  {opinion.targetPrice && (
                                    <span>Target: ${opinion.targetPrice}</span>
                                  )}
                                  {opinion.timeframe && (
                                    <span>
                                      {opinion.timeframe === "short-term"
                                        ? "Short-term"
                                        : opinion.timeframe === "medium-term"
                                        ? "Medium-term"
                                        : "Long-term"}
                                    </span>
                                  )}
                                  {opinion.sourceUrl && (
                                    <a
                                      href={opinion.sourceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-0.5 text-primary hover:underline"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      Source
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
