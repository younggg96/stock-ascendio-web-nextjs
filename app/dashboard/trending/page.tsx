"use client";

import { useEffect, useState, useTransition } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import TrendingTopicsTable from "@/components/TrendingTopicsTable";
import SectionCard from "@/components/SectionCard";
import { TrendingTopic, Platform } from "@/lib/supabase/database.types";
import { fetchTrendingTopics } from "@/lib/trendingTopicApi";
import { Hash, TrendingUp } from "lucide-react";
import { SwitchTab } from "@/components/ui/switch-tab";
import { toast } from "sonner";

const platformOptions = [
  {
    value: "all",
    label: "All",
    icon: <TrendingUp className="w-3.5 h-3.5" />,
  },
  {
    value: "TWITTER",
    label: "Twitter",
  },
  {
    value: "REDDIT",
    label: "Reddit",
  },
  {
    value: "REDNOTE",
    label: "Rednote",
  },
  {
    value: "YOUTUBE",
    label: "YouTube",
  },
];

export default function TrendingTopicsPage() {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  const loadTopics = async (platformValue?: string) => {
    try {
      setLoading(true);
      const data = await fetchTrendingTopics({
        limit: 100,
        platform:
          platformValue === "all" ? undefined : (platformValue as Platform),
        sortBy: "trending_score",
        sortDirection: "desc",
      });
      setTopics(data.topics || []);
    } catch (error) {
      console.error("Error fetching trending topics:", error);
      toast.error("Failed to load trending topics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics(activeTab);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    startTransition(() => {
      loadTopics(value);
    });
  };

  return (
    <DashboardLayout title="Trending Topics">
      <div className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-2">
          <SectionCard
            useSectionHeader={false}
            showLiveIndicator={false}
            headerBorder
            padding="md"
            scrollable
            maxHeight="calc(100vh - 100px)"
            contentClassName="space-y-0 px-4 pb-4 mt-2"
            headerRightExtra={
              <SwitchTab
                options={platformOptions}
                value={activeTab}
                onValueChange={handleTabChange}
                size="md"
                variant="pills"
                className="w-auto"
                disabled={isPending || loading}
              />
            }
          >
            <div className="min-h-[400px]">
              <TrendingTopicsTable
                topics={topics}
                loading={loading}
                onUpdate={() => loadTopics(activeTab)}
              />
            </div>
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
