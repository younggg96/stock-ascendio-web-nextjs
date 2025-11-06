import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { TrendingTicker, Platform } from "@/lib/supabase/database.types";

export interface TrendingTickerWithPrice extends TrendingTicker {
  current_price?: number;
  price_change?: number;
  price_change_percent?: number;
}

export type SortBy =
  | "trending_score"
  | "sentiment_score"
  | "mention_count"
  | "engagement_score"
  | "last_seen_at";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const platform = searchParams.get("platform") as Platform | null;
    const sortBy = (searchParams.get("sort_by") as SortBy) || "trending_score";
    const sortDirection = searchParams.get("sort_direction") || "desc";

    const supabase = createServerSupabaseClient();

    // Build query
    let query = supabase
      .from("trending_tickers")
      .select("*")
      .range(offset, offset + limit - 1);

    // Apply platform filter if provided
    if (platform) {
      query = query.eq("platform", platform);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortDirection === "asc" });

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching trending tickers:", error);
      return NextResponse.json(
        { error: "Failed to fetch trending tickers" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      tickers: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error("Error in trending tickers API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
