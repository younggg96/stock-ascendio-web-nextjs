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

      return NextResponse.json({ favorites: data });
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
