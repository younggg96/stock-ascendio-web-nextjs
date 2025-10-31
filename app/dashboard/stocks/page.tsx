import StockPageClient from "@/components/StockPageClient";
import { TrackedStock } from "@/lib/trackedStockApi";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stock Tracker - Stock Ascendio",
  description:
    "Track your favorite stocks and see what KOLs are saying about them",
};

// 强制动态渲染
export const dynamic = "force-dynamic";

// 服务器端数据获取
async function getTrackedStocks(): Promise<TrackedStock[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window === "undefined"
        ? `http://localhost:${process.env.PORT || 3000}`
        : "");
    const response = await fetch(`${baseUrl}/api/tracked-stocks`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch tracked stocks:", response.status);
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching tracked stocks:", error);
    return [];
  }
}

// 主页面组件 - 服务器组件
export default async function StockTrackerPage() {
  // 服务器端获取数据
  const stocks = await getTrackedStocks();

  return <StockPageClient initialStocks={stocks} />;
}
