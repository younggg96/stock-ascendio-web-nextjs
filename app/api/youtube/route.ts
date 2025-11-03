import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface YouTubeVideo {
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
  video_id?: string;
  channel_id?: string;
  channel_name?: string;
  channel_avatar_url?: string;
  title?: string;
  description?: string;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  video_url?: string;
  thumbnail_url?: string;
  duration?: string;
}

export interface YouTubeVideosResponse {
  count: number;
  videos: YouTubeVideo[];
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
      .eq("platform", "YOUTUBE")
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
      throw new Error(`Failed to fetch YouTube videos: ${error.message}`);
    }

    // Transform data to match expected format
    const videos: YouTubeVideo[] = (data || []).map((post) => ({
      ...post,
      // Add legacy field mappings for backward compatibility
      video_id: post.post_id,
      channel_id: post.creator_id,
      channel_name: post.creator_name,
      channel_avatar_url: post.creator_avatar_url || "",
      title: post.content.split("\n")[0] || "",
      description: post.content,
      view_count: 0,
      like_count: post.likes_count || 0,
      comment_count: 0,
      video_url: post.content_url,
      thumbnail_url: post.media_urls?.[0] || "",
      duration: "0:00",
    }));

    const response: YouTubeVideosResponse = {
      count: count || 0,
      videos,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch YouTube videos data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
