import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// POST: Favorite a post
export async function POST(request: NextRequest) {
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

    const { postId, notes } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Verify post exists in social_posts table
    const { data: postExists, error: postCheckError } = await supabase
      .from("social_posts")
      .select("post_id")
      .eq("post_id", postId)
      .single();

    if (postCheckError || !postExists) {
      console.error("Post not found:", postId, postCheckError);
      return NextResponse.json(
        { error: "Post not found", postId },
        { status: 404 }
      );
    }

    // Insert favorite
    const { data, error } = await supabase
      .from("user_post_favorites")
      .insert({
        user_id: user.id,
        post_id: postId,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      // Check for duplicate key error
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "Already favorited", favorited: true },
          { status: 200 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true, data, favorited: true });
  } catch (error) {
    console.error("Favorite post error:", error);
    return NextResponse.json(
      {
        error: "Failed to favorite post",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE: Unfavorite a post
export async function DELETE(request: NextRequest) {
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

    const { postId, favoriteId } = await request.json();

    // Delete by favoriteId if provided, otherwise by postId
    let query = supabase.from("user_post_favorites").delete();

    if (favoriteId) {
      query = query.eq("id", favoriteId);
    } else if (postId) {
      query = query.eq("user_id", user.id).eq("post_id", postId);
    } else {
      return NextResponse.json(
        { error: "Post ID or Favorite ID is required" },
        { status: 400 }
      );
    }

    const { error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, favorited: false });
  } catch (error) {
    console.error("Unfavorite post error:", error);
    return NextResponse.json(
      {
        error: "Failed to unfavorite post",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET: Get user's favorites or check if post is favorited
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
    const postId = searchParams.get("postId");

    if (postId) {
      // Check if specific post is favorited
      const { data, error } = await supabase
        .from("user_post_favorites")
        .select("*")
        .eq("user_id", user.id)
        .eq("post_id", postId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return NextResponse.json({ favorited: !!data, data });
    } else {
      // Get all favorites
      const { data, error } = await supabase
        .from("user_post_favorites")
        .select(
          `
          id,
          notes,
          created_at,
          social_posts (*)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Get unique creator IDs for manual join
      const posts = (data || [])
        .map((item: any) => item.social_posts)
        .filter(Boolean);
      const creatorIds = Array.from(
        new Set(posts.map((post: any) => post?.creator_id).filter(Boolean))
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

      // Enhance favorites with full creator info
      const enhancedFavorites = (data || []).map((item: any) => {
        const creator = creatorsMap.get(item.social_posts?.creator_id);
        return {
          ...item,
          social_posts: item.social_posts
            ? {
                ...item.social_posts,
                creator_name: creator?.display_name || "",
                creator_avatar_url: creator?.avatar_url || "",
                creator_username: creator?.username || "",
                creator_verified: creator?.verified || false,
                creator_bio: creator?.bio || null,
                creator_followers_count: creator?.followers_count || 0,
                creator_category: creator?.category || null,
                creator_influence_score: creator?.influence_score || 0,
                creator_trending_score: creator?.trending_score || 0,
              }
            : null,
        };
      });

      return NextResponse.json({ favorites: enhancedFavorites });
    }
  } catch (error) {
    console.error("Get favorites error:", error);
    return NextResponse.json(
      {
        error: "Failed to get favorites",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
