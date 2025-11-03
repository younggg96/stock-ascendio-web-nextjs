import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// POST: Like a post
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

    const { postId } = await request.json();

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

    // Insert like
    const { data, error } = await supabase
      .from("user_post_likes")
      .insert({
        user_id: user.id,
        post_id: postId,
      })
      .select()
      .single();

    if (error) {
      // Check for duplicate key error
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "Already liked", liked: true },
          { status: 200 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true, data, liked: true });
  } catch (error) {
    console.error("Like post error:", error);
    return NextResponse.json(
      {
        error: "Failed to like post",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE: Unlike a post
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

    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Delete like
    const { error } = await supabase
      .from("user_post_likes")
      .delete()
      .eq("user_id", user.id)
      .eq("post_id", postId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, liked: false });
  } catch (error) {
    console.error("Unlike post error:", error);
    return NextResponse.json(
      {
        error: "Failed to unlike post",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET: Check if post is liked
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

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Check if liked
    const { data, error } = await supabase
      .from("user_post_likes")
      .select("*")
      .eq("user_id", user.id)
      .eq("post_id", postId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = not found
      throw error;
    }

    return NextResponse.json({ liked: !!data });
  } catch (error) {
    console.error("Check like error:", error);
    return NextResponse.json(
      {
        error: "Failed to check like status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
