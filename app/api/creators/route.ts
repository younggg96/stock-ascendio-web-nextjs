import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Platform } from "@/lib/supabase/database.types";

export interface Creator {
  id: string;
  platform: Platform;
  creator_id: string;
  username: string | null;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  followers_count: number;
  verified: boolean;
  category: string | null;
  influence_score: number;
  total_posts_count: number;
  avg_engagement_rate: number;
  last_post_at: string | null;
  trending_score: number;
  metadata: any;
  created_at: string;
  updated_at: string;
  // User interaction data
  user_tracked?: boolean;
}

export type SortBy =
  | "influence_score"
  | "total_posts_count"
  | "avg_engagement_rate"
  | "trending_score"
  | "followers_count";

export interface CreatorsResponse {
  count: number;
  creators: Creator[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const platform = searchParams.get("platform") as Platform | null;
    const category = searchParams.get("category");
    const sortBy = (searchParams.get("sort_by") || "influence_score") as SortBy;
    const sortDirection = searchParams.get("sort_direction") || "desc";
    const verified = searchParams.get("verified");

    const supabase = createServerSupabaseClient();

    // Get current user (may be null if not authenticated)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Build query
    let query = supabase
      .from("creators")
      .select("*", { count: "exact" })
      .order(sortBy, { ascending: sortDirection === "asc" })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (platform) {
      query = query.eq("platform", platform);
    }

    if (category) {
      query = query.eq("category", category);
    }

    if (verified === "true") {
      query = query.eq("verified", true);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Supabase Error:", error);
      throw new Error(`Failed to fetch creators: ${error.message}`);
    }

    // Get user's tracked creators if authenticated
    let userTrackedCreators: Set<string> = new Set();

    if (user && data && data.length > 0) {
      const creatorIds = data.map((creator) => creator.creator_id);

      const { data: trackedData } = await supabase
        .from("user_kol_entries")
        .select("kol_id")
        .eq("user_id", user.id)
        .in("kol_id", creatorIds);

      userTrackedCreators = new Set(
        (trackedData || []).map((item) => item.kol_id)
      );
    }

    // Transform data to include user tracking status
    const creators: Creator[] = (data || []).map((creator) => ({
      ...creator,
      user_tracked: userTrackedCreators.has(creator.creator_id),
    }));

    const response: CreatorsResponse = {
      count: count || 0,
      creators,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch creators data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
