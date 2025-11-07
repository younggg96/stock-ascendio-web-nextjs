import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { TrendingTopic, Platform } from "@/lib/supabase/database.types";

export type SortBy =
  | "trending_score"
  | "engagement_score"
  | "mention_count"
  | "last_seen_at";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const platform = searchParams.get("platform") as Platform | null;
    const topicType = searchParams.get("topic_type") as string | null;
    const sortBy = (searchParams.get("sort_by") as SortBy) || "trending_score";
    const sortDirection = searchParams.get("sort_direction") || "desc";

    const supabase = createServerSupabaseClient();

    // Build query
    let query = supabase
      .from("trending_topics")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1);

    // Apply platform filter if provided
    if (platform) {
      query = query.eq("platform", platform);
    }

    // Apply topic type filter if provided
    if (topicType) {
      query = query.eq("topic_type", topicType);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortDirection === "asc" });

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching trending topics:", error);
      return NextResponse.json(
        { error: "Failed to fetch trending topics" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      topics: data || [],
      count: count || 0,
      total: count || 0,
    });
  } catch (error) {
    console.error("Error in trending topics API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
