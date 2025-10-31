import KOLPageClient from "@/components/KOLPageClient";
import { KOL } from "@/lib/kolApi";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KOL Tracker - Stock Ascendio",
  description:
    "Track and manage key opinion leaders across social media platforms",
};

// 强制动态渲染
export const dynamic = "force-dynamic";

// 服务器端数据获取
async function getKOLs(): Promise<KOL[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window === "undefined"
        ? `http://localhost:${process.env.PORT || 3000}`
        : "");
    const response = await fetch(`${baseUrl}/api/kol`, {
      cache: "no-store", // 确保获取最新数据
    });

    if (!response.ok) {
      console.error("Failed to fetch KOLs:", response.status);
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching KOLs:", error);
    return [];
  }
}

// 主页面组件 - 服务器组件
export default async function KOLTrackerPage() {
  // 服务器端获取数据
  const kols = await getKOLs();

  return <KOLPageClient initialKOLs={kols} />;
}
