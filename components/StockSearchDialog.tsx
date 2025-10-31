"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        <DialogHeader>
          <DialogTitle>Add Stock</DialogTitle>
        </DialogHeader>
        {/* Search Bar */}
        <div className="p-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {!searchTerm && (
            <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-white/50">
              Popular equities
            </div>
          )}

          {displayList.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-white/50">
              <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No stocks found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {displayList.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleSelectStock(stock)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Logo */}
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

                    {/* Info */}
                    <div className="text-left">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white">
                        {stock.symbol}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-white/50">
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
