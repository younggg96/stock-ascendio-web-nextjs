import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface RednoteNote {
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
  // User interaction data
  user_liked?: boolean;
  user_favorited?: boolean;
  user_tracked?: boolean;
  total_likes?: number;
  total_favorites?: number;
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

export interface RednoteNotesResponse {
  count: number;
  notes: RednoteNote[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sentiment = searchParams.get("sentiment");
    const marketRelated = searchParams.get("market_related");

    const supabase = createServerSupabaseClient();

    // Get current user (may be null if not authenticated)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Build query with full creator info
    let query = supabase
      .from("social_posts")
      .select(
        "*, creators (display_name, avatar_url, username, verified, bio, followers_count, category, influence_score, trending_score)",
        {
          count: "exact",
        }
      )
      .eq("platform", "REDNOTE")
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
      throw new Error(`Failed to fetch Rednote notes: ${error.message}`);
    }

    // Get post IDs for batch queries
    const postIds = (data || []).map((post) => post.post_id);

    // Batch query for likes and favorites counts
    const [likesCountResult, favoritesCountResult] = await Promise.all([
      supabase
        .from("user_post_likes")
        .select("post_id", { count: "exact", head: false })
        .in("post_id", postIds),
      supabase
        .from("user_post_favorites")
        .select("post_id", { count: "exact", head: false })
        .in("post_id", postIds),
    ]);

    // Get user's likes, favorites, and tracked KOLs if authenticated
    let userLikes: Set<string> = new Set();
    let userFavorites: Set<string> = new Set();
    let userTrackedCreators: Set<string> = new Set();

    if (user) {
      // Get unique creator IDs from posts
      const creatorIds = Array.from(
        new Set((data || []).map((post) => post.creator_id))
      );

      const [userLikesResult, userFavoritesResult, userTrackedResult] =
        await Promise.all([
          supabase
            .from("user_post_likes")
            .select("post_id")
            .eq("user_id", user.id)
            .in("post_id", postIds),
          supabase
            .from("user_post_favorites")
            .select("post_id")
            .eq("user_id", user.id)
            .in("post_id", postIds),
          supabase
            .from("user_kol_entries")
            .select("kol_id")
            .eq("user_id", user.id)
            .in("kol_id", creatorIds),
        ]);

      userLikes = new Set(
        (userLikesResult.data || []).map((item) => item.post_id)
      );
      userFavorites = new Set(
        (userFavoritesResult.data || []).map((item) => item.post_id)
      );
      userTrackedCreators = new Set(
        (userTrackedResult.data || []).map((item) => item.kol_id)
      );
    }

    // Count likes and favorites per post
    const likesCountMap = new Map<string, number>();
    const favoritesCountMap = new Map<string, number>();

    (likesCountResult.data || []).forEach((item) => {
      likesCountMap.set(
        item.post_id,
        (likesCountMap.get(item.post_id) || 0) + 1
      );
    });

    (favoritesCountResult.data || []).forEach((item) => {
      favoritesCountMap.set(
        item.post_id,
        (favoritesCountMap.get(item.post_id) || 0) + 1
      );
    });

    // Transform data to match expected format
    const notes: RednoteNote[] = (data || []).map((post: any) => ({
      ...post,
      // Extract creator info from JOIN
      creator_name: post.creators?.display_name || "",
      creator_avatar_url: post.creators?.avatar_url || "",
      creator_username: post.creators?.username || "",
      creator_verified: post.creators?.verified || false,
      creator_bio: post.creators?.bio || null,
      creator_followers_count: post.creators?.followers_count || 0,
      creator_category: post.creators?.category || null,
      creator_influence_score: post.creators?.influence_score || 0,
      creator_trending_score: post.creators?.trending_score || 0,
      // Add legacy field mappings for backward compatibility
      note_id: post.post_id,
      user_id: post.creator_id,
      username: post.creators?.display_name || "",
      user_avatar_url: post.creators?.avatar_url || "",
      note_url: post.content_url,
      title: post.content.split("\n")[0] || "",
      description: post.content,
      created_at: post.published_at,
      like_count: post.likes_count || 0,
      comment_count: 0,
      share_count: 0,
      image_urls: post.media_urls || [],
      // Add user interaction data
      user_liked: userLikes.has(post.post_id),
      user_favorited: userFavorites.has(post.post_id),
      user_tracked: userTrackedCreators.has(post.creator_id),
      total_likes: likesCountMap.get(post.post_id) || 0,
      total_favorites: favoritesCountMap.get(post.post_id) || 0,
    }));

    const response: RednoteNotesResponse = {
      count: count || 0,
      notes,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Rednote notes data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
