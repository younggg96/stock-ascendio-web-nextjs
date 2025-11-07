import TrendingTopicsPageClient from "@/components/TrendingTopicsPageClient";
import { TrendingTopic } from "@/lib/supabase/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trending Topics - Stock Ascendio",
  description:
    "Track trending topics across social media platforms and discover market trends",
};

export const dynamic = "force-dynamic";

async function getTrendingTopics(): Promise<TrendingTopic[]> {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("trending_topics")
      .select("*")
      .order("trending_score", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching trending topics:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching trending topics:", error);
    return [];
  }
}

export default async function TrendingTopicsPage() {
  const topics = await getTrendingTopics();

  return <TrendingTopicsPageClient initialTopics={topics} />;
}
