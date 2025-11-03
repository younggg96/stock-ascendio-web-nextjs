import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface Tweet {
  post_id: string;
  platform: string;
  creator_id: string;
  creator_name: string;
  creator_avatar_url: string | null;
  content: string;
  content_url: string;
  published_at: string;
  media_urls: string[] | null;
  likes_count: number | null;
  ai_summary: string | null;
  ai_sentiment: "negative" | "neutral" | "positive" | string | null;
  ai_tags: string[] | null;
  is_market_related: boolean | null;
  // Legacy fields for backward compatibility
  tweet_id?: string;
  screen_name?: string;
  user_id?: string;
  created_at?: string;
  num_likes?: number;
  fetched_at?: string;
  tweet_url?: string;
  full_text?: string;
  profile_image_url?: string;
}

export interface TweetsResponse {
  count: number;
  tweets: Tweet[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sentiment = searchParams.get("sentiment");
    const marketRelated = searchParams.get("market_related");

    const supabase = createServerSupabaseClient();

    // Build query
    let query = supabase
      .from("social_posts")
      .select("*", { count: "exact" })
      .eq("platform", "TWITTER")
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (sentiment) {
      query = query.eq("ai_sentiment", sentiment);
    }

    if (marketRelated === "true") {
      query = query.eq("is_market_related", true);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Supabase Error:", error);
      throw new Error(`Failed to fetch tweets: ${error.message}`);
    }

    // Transform data to match expected format (with legacy field mapping)
    const tweets: Tweet[] = (data || []).map((post) => ({
      ...post,
      // Add legacy field mappings for backward compatibility
      tweet_id: post.post_id,
      screen_name: post.creator_name,
      user_id: post.creator_id,
      created_at: post.published_at,
      num_likes: post.likes_count || 0,
      fetched_at: post.published_at,
      tweet_url: post.content_url,
      full_text: post.content,
      profile_image_url: post.creator_avatar_url || "",
    }));

    const response: TweetsResponse = {
      count: count || 0,
      tweets,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch tweets data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
