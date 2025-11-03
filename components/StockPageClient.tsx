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
import HotStocksList from "./HotStocksList";

interface StockPageClientProps {
  initialStocks: TrackedStock[];
}

export default function StockPageClient({
  initialStocks,
}: StockPageClientProps) {
  const [stocks, setStocks] = useState<TrackedStock[]>(initialStocks);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Reload stocks
  const loadStocks = async () => {
    try {
      const response = await fetch("/api/tracked-stocks");
      if (!response.ok) throw new Error("Failed to fetch stocks");
      const data = await response.json();
      setStocks(data);
    } catch (error) {
      console.error("Error loading stocks:", error);
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
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300 overflow-hidden">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title="Stock Tracker"
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-2 p-2 overflow-hidden">
          {/* Left Column - My Tracked Stocks */}
          <div className="xl:col-span-2 flex flex-col min-h-0">
            <SectionCard
              title="My Watchlist"
              useSectionHeader
              scrollable
              className="h-full flex flex-col"
              contentClassName="px-4 pb-4"
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
              <TrackedStocksTable stocks={stocks} onUpdate={loadStocks} />
            </SectionCard>
          </div>

          {/* Right Column - Market Indices, Watchlist & Hot Stocks */}
          <div className="space-y-2 xl:col-span-1 overflow-y-auto">
            <HotStocksList />
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
