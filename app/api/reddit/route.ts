import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface RedditComment {
  score: number;
  comment_id: string;
  body: string;
  created_utc: number;
  author: string;
}

export interface RedditPost {
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
  user_id?: string;
  username?: string;
  user_avatar_url?: string;
  title?: string;
  selftext?: string;
  subreddit?: string;
  score?: number;
  permalink?: string;
  url?: string;
  num_comments?: number;
  created_utc?: string;
  top_comments?: RedditComment[];
}

export interface RedditPostsResponse {
  count: number;
  posts: RedditPost[];
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
      .eq("platform", "REDDIT")
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
      throw new Error(`Failed to fetch Reddit posts: ${error.message}`);
    }

    // Transform data to match expected format
    const posts: RedditPost[] = (data || []).map((post) => ({
      ...post,
      // Add legacy field mappings for backward compatibility
      user_id: post.creator_id,
      username: post.creator_name,
      user_avatar_url: post.creator_avatar_url || "",
      title: post.content.split("\n")[0] || "",
      selftext: post.content,
      subreddit: "wallstreetbets", // Default value
      score: post.likes_count || 0,
      permalink: post.content_url,
      url: post.content_url,
      num_comments: 0,
      created_utc: post.published_at,
      top_comments: [],
    }));

    const response: RedditPostsResponse = {
      count: count || 0,
      posts,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Reddit posts data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
