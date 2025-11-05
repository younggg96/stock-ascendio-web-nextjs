import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Platform } from "@/lib/supabase/database.types";

export interface TrackedKOL {
  user_id: string;
  kol_id: string;
  platform: Platform;
  notify: boolean;
  updated_at: string;
  // Additional KOL info from social_posts
  creator_name?: string;
  creator_avatar_url?: string;
  posts_count?: number;
  latest_post_date?: string;
}

export interface CreateTrackedKOLInput {
  kol_id: string;
  platform: Platform;
  notify?: boolean;
}

export interface UpdateTrackedKOLInput {
  notify?: boolean;
}

// GET - 获取当前用户追踪的所有 KOL
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "User not authenticated" },
        { status: 401 }
      );
    }

    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get("platform") as Platform | null;
    const notify = searchParams.get("notify");

    // 构建查询
    let query = supabase
      .from("user_kol_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    // 如果指定了平台，添加过滤
    if (platform) {
      query = query.eq("platform", platform);
    }

    // 如果指定了通知状态，添加过滤
    if (notify !== null) {
      query = query.eq("notify", notify === "true");
    }

    const { data: trackedKOLs, error: queryError } = await query;

    if (queryError) {
      console.error("Error fetching tracked KOLs:", queryError);
      return NextResponse.json(
        {
          error: "Failed to fetch tracked KOLs",
          message: queryError.message,
        },
        { status: 500 }
      );
    }

    // 获取每个 KOL 的额外信息（从 social_posts 表）
    const enrichedKOLs = await Promise.all(
      (trackedKOLs || []).map(async (kol) => {
        // 获取该 KOL 的帖子统计信息和 creator 详细信息
        const { data: posts, count } = await supabase
          .from("social_posts")
          .select(
            "published_at, creators (display_name, avatar_url, username, verified, bio, followers_count, category, influence_score, trending_score)",
            {
              count: "exact",
              head: false,
            }
          )
          .eq("creator_id", kol.kol_id)
          .eq("platform", kol.platform)
          .order("published_at", { ascending: false })
          .limit(1);

        const latestPost: any = posts?.[0];
        const creatorInfo = latestPost?.creators;

        return {
          ...kol,
          creator_name: creatorInfo?.display_name || kol.kol_id,
          creator_avatar_url: creatorInfo?.avatar_url || null,
          creator_username: creatorInfo?.username || "",
          creator_verified: creatorInfo?.verified || false,
          creator_bio: creatorInfo?.bio || null,
          creator_followers_count: creatorInfo?.followers_count || 0,
          creator_category: creatorInfo?.category || null,
          creator_influence_score: creatorInfo?.influence_score || 0,
          creator_trending_score: creatorInfo?.trending_score || 0,
          posts_count: count || 0,
          latest_post_date: latestPost?.published_at || null,
        } as TrackedKOL;
      })
    );

    return NextResponse.json({
      count: enrichedKOLs.length,
      tracked_kols: enrichedKOLs,
    });
  } catch (error) {
    console.error("My tracked KOLs GET error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST - 添加新的追踪 KOL
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "User not authenticated" },
        { status: 401 }
      );
    }

    // 解析请求体
    const body: CreateTrackedKOLInput = await request.json();

    // 验证必需字段
    if (!body.kol_id || !body.platform) {
      return NextResponse.json(
        { error: "Missing required fields: kol_id and platform" },
        { status: 400 }
      );
    }

    // 检查是否已经追踪该 KOL
    const { data: existing } = await supabase
      .from("user_kol_entries")
      .select("*")
      .eq("user_id", user.id)
      .eq("kol_id", body.kol_id)
      .eq("platform", body.platform)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Already tracking this KOL" },
        { status: 409 }
      );
    }

    // 插入新的追踪记录
    const { data: newTracking, error: insertError } = await supabase
      .from("user_kol_entries")
      .insert({
        user_id: user.id,
        kol_id: body.kol_id,
        platform: body.platform,
        notify: body.notify ?? true,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating tracked KOL:", insertError);
      return NextResponse.json(
        {
          error: "Failed to track KOL",
          message: insertError.message,
        },
        { status: 500 }
      );
    }

    // 获取 KOL 的详细信息
    const { data: kolInfo } = await supabase
      .from("social_posts")
      .select(
        "creators (display_name, avatar_url, username, verified, bio, followers_count, category, influence_score, trending_score)"
      )
      .eq("creator_id", body.kol_id)
      .eq("platform", body.platform)
      .limit(1)
      .single();

    const creators: any = kolInfo?.creators;

    return NextResponse.json(
      {
        ...newTracking,
        creator_name: creators?.display_name || body.kol_id,
        creator_avatar_url: creators?.avatar_url || null,
        creator_username: creators?.username || "",
        creator_verified: creators?.verified || false,
        creator_bio: creators?.bio || null,
        creator_followers_count: creators?.followers_count || 0,
        creator_category: creators?.category || null,
        creator_influence_score: creators?.influence_score || 0,
        creator_trending_score: creators?.trending_score || 0,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("My tracked KOLs POST error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PATCH - 更新追踪的 KOL（主要是通知设置）
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "User not authenticated" },
        { status: 401 }
      );
    }

    // 解析请求体
    const body: UpdateTrackedKOLInput & { kol_id: string; platform: Platform } =
      await request.json();

    // 验证必需字段
    if (!body.kol_id || !body.platform) {
      return NextResponse.json(
        { error: "Missing required fields: kol_id and platform" },
        { status: 400 }
      );
    }

    // 更新追踪记录
    const { data: updated, error: updateError } = await supabase
      .from("user_kol_entries")
      .update({
        notify: body.notify,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("kol_id", body.kol_id)
      .eq("platform", body.platform)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating tracked KOL:", updateError);
      return NextResponse.json(
        {
          error: "Failed to update tracked KOL",
          message: updateError.message,
        },
        { status: 500 }
      );
    }

    if (!updated) {
      return NextResponse.json(
        { error: "Tracked KOL not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("My tracked KOLs PATCH error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - 取消追踪 KOL
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "User not authenticated" },
        { status: 401 }
      );
    }

    // 从查询参数或请求体获取参数
    const searchParams = request.nextUrl.searchParams;
    let kol_id = searchParams.get("kol_id");
    let platform = searchParams.get("platform") as Platform | null;

    // 如果查询参数中没有，尝试从请求体获取
    if (!kol_id || !platform) {
      const body: { kol_id: string; platform: Platform } = await request.json();
      kol_id = body.kol_id;
      platform = body.platform;
    }

    // 验证必需字段
    if (!kol_id || !platform) {
      return NextResponse.json(
        { error: "Missing required fields: kol_id and platform" },
        { status: 400 }
      );
    }

    // 删除追踪记录
    const { error: deleteError } = await supabase
      .from("user_kol_entries")
      .delete()
      .eq("user_id", user.id)
      .eq("kol_id", kol_id)
      .eq("platform", platform);

    if (deleteError) {
      console.error("Error deleting tracked KOL:", deleteError);
      return NextResponse.json(
        {
          error: "Failed to untrack KOL",
          message: deleteError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully untracked KOL",
    });
  } catch (error) {
    console.error("My tracked KOLs DELETE error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
