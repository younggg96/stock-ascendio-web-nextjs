"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import HotStocksList from "@/components/HotStocksList";
import Watchlist from "@/components/Watchlist";
import PostList from "@/components/PostList";
import { useMarketIndices } from "@/hooks/useStockData";
import { useState } from "react";

export default function Dashboard() {
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300 overflow-hidden">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

        <div className="flex-1 gap-2 p-2 overflow-hidden">
          <PostList />
        </div>
      </main>
    </div>
  );
}
