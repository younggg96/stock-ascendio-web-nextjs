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
  // User interaction data
  user_liked?: boolean;
  user_favorited?: boolean;
  user_tracked?: boolean;
  total_likes?: number;
  total_favorites?: number;
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

    // Get current user (may be null if not authenticated)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Build query - First get posts only
    let query = supabase
      .from("social_posts")
      .select("*", {
        count: "exact",
      })
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

    // Manually join creator data
    const creatorIds = Array.from(
      new Set((data || []).map((post) => post.creator_id))
    );

    const { data: creatorsData, error: creatorsError } = await supabase
      .from("creators")
      .select(
        "id, display_name, avatar_url, username, verified, bio, followers_count, category, influence_score, trending_score"
      )
      .in("id", creatorIds);

    if (creatorsError) {
      console.error("Creators query error:", creatorsError);
    }

    // Create a map of creators by ID
    const creatorsMap = new Map(
      (creatorsData || []).map((creator) => [creator.id, creator])
    );

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

    console.log("data", data);

    // Transform data to match expected format
    const posts: RedditPost[] = (data || []).map((post: any) => {
      const creator = creatorsMap.get(post.creator_id);
      return {
        ...post,
        // Extract creator info from manual join
        creator_name: creator?.display_name || "",
        creator_avatar_url: creator?.avatar_url || "",
        creator_username: creator?.username || "",
        creator_verified: creator?.verified || false,
        creator_bio: creator?.bio || null,
        creator_followers_count: creator?.followers_count || 0,
        creator_category: creator?.category || null,
        creator_influence_score: creator?.influence_score || 0,
        creator_trending_score: creator?.trending_score || 0,
        // Add legacy field mappings for backward compatibility
        user_id: post.creator_id,
        username: creator?.display_name || "",
        user_avatar_url: creator?.avatar_url || "",
        title: post.content.split("\n")[0] || "",
        selftext: post.content,
        subreddit: "wallstreetbets", // Default value
        score: post.likes_count || 0,
        permalink: post.content_url,
        url: post.content_url,
        num_comments: 0,
        created_utc: post.published_at,
        top_comments: [],
        // Add user interaction data
        user_liked: userLikes.has(post.post_id),
        user_favorited: userFavorites.has(post.post_id),
        user_tracked: userTrackedCreators.has(post.creator_id),
        total_likes: likesCountMap.get(post.post_id) || 0,
        total_favorites: favoritesCountMap.get(post.post_id) || 0,
      };
    });

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
