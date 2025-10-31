"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SectionCard from "@/components/SectionCard";
import TrackedStocksTable from "@/components/TrackedStocksTable";
import StockSearchDialog from "@/components/StockSearchDialog";
import { TrackedStock, createTrackedStock } from "@/lib/trackedStockApi";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface StockPageClientProps {
  initialStocks: TrackedStock[];
}

export default function StockPageClient({
  initialStocks,
}: StockPageClientProps) {
  const [stocks, setStocks] = useState<TrackedStock[]>(initialStocks);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Reload stocks
  const loadStocks = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch("/api/tracked-stocks");
      if (!response.ok) throw new Error("Failed to fetch stocks");
      const data = await response.json();
      setStocks(data);
    } catch (error) {
      console.error("Error loading stocks:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle stock selection from search dialog
  const handleStockSelect = async (stock: {
    symbol: string;
    name: string;
    logo?: string;
  }) => {
    try {
      await createTrackedStock({
        symbol: stock.symbol,
        companyName: stock.name,
        logo: stock.logo,
      });
      toast.success("Stock added successfully");
      loadStocks();
    } catch (error) {
      toast.error("Failed to add stock");
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title="Stock Tracker"
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <div className="flex-1 p-2 overflow-y-auto">
          <div className="space-y-2">
            {/* My Tracked Stocks */}
            <SectionCard
              title="My Watchlist"
              useSectionHeader
              headerRightExtra={
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stock</span>
                </Button>
              }
            >
              <div className="px-4 pb-4">
                <TrackedStocksTable stocks={stocks} onUpdate={loadStocks} />
              </div>
            </SectionCard>
          </div>
        </div>
      </main>

      {/* Stock Search Dialog */}
      <StockSearchDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSelect={handleStockSelect}
      />
    </div>
  );
}
