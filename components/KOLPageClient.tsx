"use client";

import { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import SectionCard from "@/components/SectionCard";
import KOLTrackerTable from "@/components/KOLTrackerTable";
import TopKOLRanking from "@/components/TopKOLRanking";
import { SwitchTab } from "@/components/ui/switch-tab";
import { KOL } from "@/lib/kolApi";
import { Star, TrendingUp } from "lucide-react";
import { useTrackedKOLs } from "@/hooks";
import type { Platform } from "@/lib/supabase/database.types";

interface KOLPageClientProps {
  initialKOLs: KOL[];
}

export default function KOLPageClient({ initialKOLs }: KOLPageClientProps) {
  const [kols, setKols] = useState<KOL[]>(initialKOLs);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"tracked" | "ranking">("ranking");

  // Use the tracked KOLs hook to get real data from the API
  const {
    trackedKOLs: apiTrackedKOLs,
    isLoading: isLoadingTracked,
    refresh: refreshTracked,
  } = useTrackedKOLs();

  // Convert TrackedKOL to KOL format for compatibility with KOLTrackerTable
  const convertedTrackedKOLs = useMemo<KOL[]>(() => {
    return apiTrackedKOLs.map((tracked) => {
      // Map platform types
      const platformMap: {
        [key: string]: "twitter" | "reddit" | "youtube" | "rednote";
      } = {
        TWITTER: "twitter",
        REDDIT: "reddit",
        YOUTUBE: "youtube",
        REDNOTE: "rednote",
      };

      return {
        id: `${tracked.platform}-${tracked.kol_id}`,
        name: tracked.creator_name || tracked.kol_id,
        username: tracked.kol_id,
        platform: platformMap[tracked.platform] || "twitter",
        followers: 0, // This info is not available from user_kol_entries
        description: `${tracked.posts_count || 0} posts`,
        avatarUrl: tracked.creator_avatar_url || "",
        isTracking: true,
        createdAt: tracked.updated_at,
        updatedAt: tracked.updated_at,
      };
    });
  }, [apiTrackedKOLs]);

  // Reload KOLs (for Top Ranking tab)
  const loadKOLs = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch("/api/kol");
      if (!response.ok) throw new Error("Failed to fetch KOLs");
      const data = await response.json();
      setKols(data);
    } catch (error) {
      console.error("Error loading KOLs:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Reload tracked KOLs when switching to the tracked tab
  useEffect(() => {
    if (activeTab === "tracked") {
      refreshTracked();
    }
  }, [activeTab, refreshTracked]);

  // Tab options - use useMemo to avoid recreating on every render
  const tabOptions = useMemo(
    () => [
      {
        value: "ranking",
        label: "Top Ranking",
        icon: <TrendingUp className="w-3.5 h-3.5" />,
      },
      {
        value: "tracked",
        label: "Tracking KOLs",
        icon: <Star className="w-3.5 h-3.5" />,
      },
    ],
    []
  );

  return (
    <DashboardLayout title="KOL Tracker">
      <div className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-2">
          {/* Unified KOL Table with Tab Switcher */}
          <SectionCard
            useSectionHeader
            headerExtra={
              <SwitchTab
                options={tabOptions}
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as "tracked" | "ranking")
                }
                size="md"
                variant="pills"
              />
            }
          >
            <div className="px-4 pb-4">
              {activeTab === "tracked" ? (
                <KOLTrackerTable
                  kols={convertedTrackedKOLs}
                  onUpdate={refreshTracked}
                />
              ) : (
                <TopKOLRanking kols={kols} onUpdate={loadKOLs} />
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
