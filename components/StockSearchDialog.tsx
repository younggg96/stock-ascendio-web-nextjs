"use client";

import { useState, useEffect } from "react";
import CompanyLogo from "./CompanyLogo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (stock: StockSearchResult) => void;
}

interface StockSearchResult {
  symbol: string;
  name: string;
  logo?: string;
  type?: "equity" | "crypto" | "index";
}

// 热门股票列表
const popularEquities: StockSearchResult[] = [
  {
    symbol: "TSLA",
    name: "Tesla",
    logo: "https://logo.clearbit.com/tesla.com",
    type: "equity",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA",
    logo: "https://logo.clearbit.com/nvidia.com",
    type: "equity",
  },
  {
    symbol: "AAPL",
    name: "Apple",
    logo: "https://logo.clearbit.com/apple.com",
    type: "equity",
  },
  {
    symbol: "AMZN",
    name: "Amazon",
    logo: "https://logo.clearbit.com/amazon.com",
    type: "equity",
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    logo: "https://logo.clearbit.com/microsoft.com",
    type: "equity",
  },
  {
    symbol: "GOOGL",
    name: "Google",
    logo: "https://logo.clearbit.com/google.com",
    type: "equity",
  },
  {
    symbol: "META",
    name: "Meta",
    logo: "https://logo.clearbit.com/meta.com",
    type: "equity",
  },
  {
    symbol: "NFLX",
    name: "Netflix",
    logo: "https://logo.clearbit.com/netflix.com",
    type: "equity",
  },
];

export default function StockSearchDialog({
  open,
  onOpenChange,
  onSelect,
}: StockSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);

  // 搜索逻辑
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toUpperCase();
    const filtered = popularEquities.filter(
      (stock) =>
        stock.symbol.includes(term) ||
        stock.name.toUpperCase().includes(term.toUpperCase())
    );
    setSearchResults(filtered);
  }, [searchTerm]);

  // 显示的列表：搜索结果或热门股票
  const displayList = searchTerm ? searchResults : popularEquities;

  const handleSelectStock = (stock: StockSearchResult) => {
    onSelect(stock);
    setSearchTerm("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-[500px] sm:max-w-[500px] !py-3 !px-0 gap-0 max-h-[85vh] sm:max-h-[600px]">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle className="text-lg sm:text-xl">Add Stock</DialogTitle>
        </DialogHeader>

        {/* Search Bar */}
        <div className="px-4 pb-3 sm:px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 sm:h-10 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-base sm:text-sm"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[calc(85vh-120px)] sm:max-h-[440px] min-h-[400px] overflow-y-auto overscroll-contain">
          {!searchTerm && (
            <div className="px-4 py-2 sm:px-6 text-xs font-medium text-gray-500 dark:text-white/50 tracking-wide">
              Popular stocks
            </div>
          )}

          {displayList.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-center py-12 sm:py-8 text-gray-500 dark:text-white/50">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-base sm:text-sm">No stocks found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/5 min-h-[400px]">
              {displayList.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleSelectStock(stock)}
                  className="w-full px-4 py-4 sm:px-6 sm:py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 active:bg-gray-100 dark:active:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-3">
                    {/* Logo */}
                    {stock.logo ? (
                      <CompanyLogo
                        logoUrl={stock.logo}
                        symbol={stock.symbol}
                        name={stock.name}
                        size="md"
                        shape="rounded"
                        border="light"
                        unoptimized
                        className="w-10 h-10 sm:w-8 sm:h-8"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-8 sm:h-8 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700">
                        <Building2 className="w-5 h-5 sm:w-4 sm:h-4 text-gray-400" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="text-left">
                      <div className="font-semibold text-base sm:text-sm text-gray-900 dark:text-white">
                        {stock.symbol}
                      </div>
                      <div className="text-sm sm:text-xs text-gray-500 dark:text-white/50">
                        {stock.name}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
