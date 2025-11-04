import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// GET: Get user's liked and favorited posts
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type"); // 'liked' or 'favorited'
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (type === "liked") {
      // Get user's liked posts
      const { data, error } = await supabase
        .from("user_post_likes")
        .select(
          `
          post_id,
          created_at,
          social_posts (*)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw error;
      }

      // Get post IDs for batch queries
      const posts = data.map((item: any) => item.social_posts).filter(Boolean);
      const postIds = posts.map((post: any) => post.post_id);

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

      // Get user's favorites
      const userFavoritesResult = await supabase
        .from("user_post_favorites")
        .select("post_id")
        .eq("user_id", user.id)
        .in("post_id", postIds);

      const userFavorites = new Set(
        (userFavoritesResult.data || []).map((item) => item.post_id)
      );

      // Count likes and favorites per post
      const likesCountMap = new Map<string, number>();
      const favoritesCountMap = new Map<string, number>();

      (likesCountResult.data || []).forEach((item: any) => {
        likesCountMap.set(
          item.post_id,
          (likesCountMap.get(item.post_id) || 0) + 1
        );
      });

      (favoritesCountResult.data || []).forEach((item: any) => {
        favoritesCountMap.set(
          item.post_id,
          (favoritesCountMap.get(item.post_id) || 0) + 1
        );
      });

      // Enhance posts with interaction data and include like timestamp
      const enhancedPosts = data.map((item: any) => ({
        ...item.social_posts,
        user_liked: true, // All posts in this list are liked by the user
        user_favorited: userFavorites.has(item.social_posts.post_id),
        total_likes: likesCountMap.get(item.social_posts.post_id) || 0,
        total_favorites: favoritesCountMap.get(item.social_posts.post_id) || 0,
        liked_at: item.created_at, // Include when user liked this post
      }));

      return NextResponse.json({ posts: enhancedPosts, count: data.length });
    } else if (type === "favorited") {
      // Get user's favorited posts
      const { data, error } = await supabase
        .from("user_post_favorites")
        .select(
          `
          id,
          post_id,
          notes,
          created_at,
          social_posts (*)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw error;
      }

      // Get post IDs for batch queries
      const posts = data.map((item: any) => item.social_posts).filter(Boolean);
      const postIds = posts.map((post: any) => post.post_id);

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

      // Get user's likes
      const userLikesResult = await supabase
        .from("user_post_likes")
        .select("post_id")
        .eq("user_id", user.id)
        .in("post_id", postIds);

      const userLikes = new Set(
        (userLikesResult.data || []).map((item) => item.post_id)
      );

      // Count likes and favorites per post
      const likesCountMap = new Map<string, number>();
      const favoritesCountMap = new Map<string, number>();

      (likesCountResult.data || []).forEach((item: any) => {
        likesCountMap.set(
          item.post_id,
          (likesCountMap.get(item.post_id) || 0) + 1
        );
      });

      (favoritesCountResult.data || []).forEach((item: any) => {
        favoritesCountMap.set(
          item.post_id,
          (favoritesCountMap.get(item.post_id) || 0) + 1
        );
      });

      // Enhance posts with interaction data and include favorite notes
      const enhancedPosts = data.map((item: any) => ({
        ...item.social_posts,
        user_liked: userLikes.has(item.social_posts.post_id),
        user_favorited: true, // All posts in this list are favorited by the user
        total_likes: likesCountMap.get(item.social_posts.post_id) || 0,
        total_favorites: favoritesCountMap.get(item.social_posts.post_id) || 0,
        favorite_notes: item.notes, // Include user's notes for this favorite
        favorite_id: item.id, // Include favorite ID for potential updates
      }));

      return NextResponse.json({ posts: enhancedPosts, count: data.length });
    } else {
      return NextResponse.json(
        { error: "Invalid type parameter. Use 'liked' or 'favorited'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Get user posts error:", error);
    return NextResponse.json(
      {
        error: "Failed to get user posts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
