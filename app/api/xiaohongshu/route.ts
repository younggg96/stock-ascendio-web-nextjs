import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface XiaohongshuNote {
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
  note_id?: string;
  user_id?: string;
  username?: string;
  user_avatar_url?: string;
  note_url?: string;
  title?: string;
  description?: string;
  created_at?: string;
  like_count?: number;
  comment_count?: number;
  share_count?: number;
  image_urls?: string[];
}

export interface XiaohongshuNotesResponse {
  count: number;
  notes: XiaohongshuNote[];
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
      .eq("platform", "XIAOHONGSHU")
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
      throw new Error(`Failed to fetch Xiaohongshu notes: ${error.message}`);
    }

    // Transform data to match expected format
    const notes: XiaohongshuNote[] = (data || []).map((post) => ({
      ...post,
      // Add legacy field mappings for backward compatibility
      note_id: post.post_id,
      user_id: post.creator_id,
      username: post.creator_name,
      user_avatar_url: post.creator_avatar_url || "",
      note_url: post.content_url,
      title: post.content.split("\n")[0] || "",
      description: post.content,
      created_at: post.published_at,
      like_count: post.likes_count || 0,
      comment_count: 0,
      share_count: 0,
      image_urls: post.media_urls || [],
    }));

    const response: XiaohongshuNotesResponse = {
      count: count || 0,
      notes,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Xiaohongshu notes data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
