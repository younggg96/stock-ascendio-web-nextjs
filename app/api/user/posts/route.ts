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
      console.log(data);

      // Get post IDs for batch queries
      const posts = data.map((item: any) => item.social_posts).filter(Boolean);
      const postIds = posts.map((post: any) => post.post_id);

      // Get unique creator IDs for manual join
      const creatorIds = Array.from(
        new Set(posts.map((post: any) => post.creator_id))
      );

      // Manually join creator data
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

      // Batch query for likes, favorites counts, and tracked creators
      const [likesCountResult, favoritesCountResult, userTrackedResult] =
        await Promise.all([
          supabase
            .from("user_post_likes")
            .select("post_id", { count: "exact", head: false })
            .in("post_id", postIds),
          supabase
            .from("user_post_favorites")
            .select("post_id", { count: "exact", head: false })
            .in("post_id", postIds),
          supabase
            .from("user_kol_entries")
            .select("kol_id")
            .eq("user_id", user.id)
            .in("kol_id", creatorIds),
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
      const userTrackedCreators = new Set(
        (userTrackedResult.data || []).map((item) => item.kol_id)
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
      const enhancedPosts = data.map((item: any) => {
        const creator = creatorsMap.get(item.social_posts?.creator_id);
        return {
          ...item.social_posts,
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
          user_liked: true, // All posts in this list are liked by the user
          user_favorited: userFavorites.has(item.social_posts.post_id),
          user_tracked: userTrackedCreators.has(item.social_posts.creator_id),
          total_likes: likesCountMap.get(item.social_posts.post_id) || 0,
          total_favorites:
            favoritesCountMap.get(item.social_posts.post_id) || 0,
          liked_at: item.created_at, // Include when user liked this post
        };
      });

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

      // Get unique creator IDs for manual join
      const creatorIds = Array.from(
        new Set(posts.map((post: any) => post.creator_id))
      );

      // Manually join creator data
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

      // Batch query for likes, favorites counts, and tracked creators
      const [likesCountResult, favoritesCountResult, userTrackedResult] =
        await Promise.all([
          supabase
            .from("user_post_likes")
            .select("post_id", { count: "exact", head: false })
            .in("post_id", postIds),
          supabase
            .from("user_post_favorites")
            .select("post_id", { count: "exact", head: false })
            .in("post_id", postIds),
          supabase
            .from("user_kol_entries")
            .select("kol_id")
            .eq("user_id", user.id)
            .in("kol_id", creatorIds),
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
      const userTrackedCreators = new Set(
        (userTrackedResult.data || []).map((item) => item.kol_id)
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
      const enhancedPosts = data.map((item: any) => {
        const creator = creatorsMap.get(item.social_posts?.creator_id);
        return {
          ...item.social_posts,
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
          user_liked: userLikes.has(item.social_posts.post_id),
          user_favorited: true, // All posts in this list are favorited by the user
          user_tracked: userTrackedCreators.has(item.social_posts.creator_id),
          total_likes: likesCountMap.get(item.social_posts.post_id) || 0,
          total_favorites:
            favoritesCountMap.get(item.social_posts.post_id) || 0,
          favorite_notes: item.notes, // Include user's notes for this favorite
          favorite_id: item.id, // Include favorite ID for potential updates
        };
      });

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
