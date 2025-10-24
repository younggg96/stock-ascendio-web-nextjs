"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import TradingViewChart from "@/components/TradingViewChart";
import { useStockQuote } from "@/hooks/useStockData";
import { useTheme } from "next-themes";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

interface StockPageProps {
  params: {
    symbol: string;
  };
}

export default function StockPage({ params }: StockPageProps) {
  const router = useRouter();
  const symbol = params.symbol.toUpperCase();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch stock quote data
  const { data: stockQuote, loading, error } = useStockQuote(symbol, 30000);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const isPositive = stockQuote ? stockQuote.change >= 0 : true;

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col">
        <Header
          title={`${symbol} - ${stockQuote?.name || "Loading..."}`}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-5">
            {/* Back button */}
            <div className="mb-4 lg:mb-6">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Main Chart Area */}
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark p-4 lg:p-6 transition-colors duration-300">
                  {/* TradingView Chart */}
                  {mounted && (
                    <div className="w-full" style={{ height: "600px" }}>
                      <TradingViewChart
                        symbol={symbol}
                        theme={theme === "dark" ? "dark" : "light"}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar - Stock Info */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark p-4 lg:p-6 transition-colors duration-300 sticky top-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Stock Information
                  </h3>
                  {loading && !stockQuote ? (
                    <div className="space-y-4 animate-pulse">
                      {[...Array(6)].map((_, i) => (
                        <div key={i}>
                          <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-20 mb-2" />
                          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-full" />
                        </div>
                      ))}
                    </div>
                  ) : stockQuote ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-white/50 mb-1">
                          Symbol
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {stockQuote.symbol}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-white/50 mb-1">
                          Company Name
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {stockQuote.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-white/50 mb-1">
                          Current Price
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ${stockQuote.price.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-white/50 mb-1">
                          Change
                        </p>
                        <p
                          className={`font-semibold ${
                            isPositive ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {isPositive ? "+" : ""}
                          {stockQuote.change.toFixed(2)} (
                          {stockQuote.changePercent.toFixed(2)}%)
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-white/50 mb-1">
                          Volume
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {stockQuote.volume?.toLocaleString() || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-white/50 mb-1">
                          Market Cap
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {stockQuote.marketCap
                            ? `$${(stockQuote.marketCap / 1e9).toFixed(2)}B`
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="text-center text-red-500 text-sm">
                      <p>Failed to load stock data</p>
                      <p className="text-xs mt-1">{error}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
